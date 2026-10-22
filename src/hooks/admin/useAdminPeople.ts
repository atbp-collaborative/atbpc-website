/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Member, MemberCategory, Track } from '@/types';
import {
  getMembers as getMembersFromDataService,
} from '@/services/dummy-data.service';
import {
  getMembers as getMembersStorage,
  getTracks,
  saveMember as saveMemberStorage,
  deleteMember as deleteMemberStorage,
  toggleMemberDraft as toggleMemberDraftStorage,
} from '@/services/mock/adminMockStorage';
import {
  savePersonAction,
  deletePersonAction,
  togglePersonDraftAction,
  fetchAdminPeopleAction,
  reorderPeopleAction,
} from '@/app/actions/admin-mutations';
import { toast } from 'sonner';

export type PeopleClassificationFilter = 'all' | MemberCategory;
export type VisibilityFilter = 'all' | 'published' | 'draft';

export function useAdminPeople(initialMembers?: Member[]) {
  const [members, setMembers] = useState<Member[]>(initialMembers || []);
  const initialOrderRef = useRef<string[]>(
    initialMembers && initialMembers.length > 0
      ? [...initialMembers]
          .sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99))
          .map((m) => m.id)
      : []
  );
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [classificationFilter, setClassificationFilter] = useState<PeopleClassificationFilter>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
  const [isLoading, setIsLoading] = useState(!initialMembers || initialMembers.length === 0);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const dbPeople = await fetchAdminPeopleAction();
      const data = dbPeople.length > 0 ? dbPeople : await getMembersFromDataService(true);
      const sortedData = [...data].sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));
      initialOrderRef.current = sortedData.map((m) => m.id);
      setMembers(sortedData);

      // Check if user created any local members before live Supabase sync
      const local = getMembersStorage();
      for (const m of local) {
        if (!data.some((dbM) => dbM.id === m.id || dbM.name.toLowerCase() === m.name.toLowerCase())) {
          console.log(`[useAdminPeople] Syncing local member "${m.name}" to Supabase...`);
          await savePersonAction(m);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch people from Supabase, falling back to local storage:', err);
      const data = getMembersStorage();
      setMembers(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialMembers || initialMembers.length === 0) {
      refresh();
    }
  }, [refresh, initialMembers]);

  const isOrderDirty = useMemo(() => {
    if (!initialOrderRef.current || initialOrderRef.current.length === 0) return false;
    const currentOrder = [...members]
      .sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99))
      .map((m) => m.id);
    if (currentOrder.length !== initialOrderRef.current.length) return false;
    return currentOrder.some((id, idx) => id !== initialOrderRef.current[idx]);
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // Search matches name, role, or license
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        member.name.toLowerCase().includes(term) ||
        member.role.toLowerCase().includes(term) ||
        (member.license && member.license.toLowerCase().includes(term));

      // Category filter
      const matchesCategory =
        classificationFilter === 'all' ||
        (member.categories && member.categories.includes(classificationFilter as MemberCategory));

      // Visibility filter
      const matchesVisibility =
        visibilityFilter === 'all' ||
        (visibilityFilter === 'draft' && Boolean(member.isDraft)) ||
        (visibilityFilter === 'published' && !member.isDraft);

      return matchesSearch && matchesCategory && matchesVisibility;
    })
    .sort((a, b) => {
      const aHired = a.isCurrentlyHired !== false;
      const bHired = b.isCurrentlyHired !== false;
      if (aHired && !bHired) return -1;
      if (!aHired && bHired) return 1;
      return (a.displayOrder ?? 99) - (b.displayOrder ?? 99);
    });
  }, [members, searchTerm, classificationFilter, visibilityFilter]);

  const saveMember = useCallback(async (memberData: Member) => {
    // Keep local storage synchronized as backup
    saveMemberStorage(memberData);

    const res = await savePersonAction(memberData);
    if (!res.success) {
      toast.error(`Database error: ${res.error}`);
      return memberData;
    }

    const saved = res.data || memberData;
    setMembers((prev) => {
      const idx = prev.findIndex((m) => m.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    toast.success(`Member "${saved.name}" saved successfully to database`);
    return saved;
  }, []);

  const deleteMember = useCallback(async (id: string) => {
    const target = members.find((m) => m.id === id);
    deleteMemberStorage(id);
    setMembers((prev) => prev.filter((m) => m.id !== id));

    const res = await deletePersonAction(id);
    if (!res.success) {
      toast.error(`Database error: ${res.error}`);
      return;
    }
    toast.success(`Member "${target?.name || id}" removed from database`);
  }, [members]);

  const toggleDraft = useCallback(async (id: string) => {
    const target = members.find((m) => m.id === id);
    const newDraftState = !target?.isDraft;

    toggleMemberDraftStorage(id);
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isDraft: newDraftState } : m))
    );

    const res = await togglePersonDraftAction(id, newDraftState);
    if (!res.success) {
      toast.error(`Database error: ${res.error}`);
      return;
    }
    toast.info(`Member status set to ${newDraftState ? 'Draft' : 'Published'}`);
  }, [members]);

  const moveMember = useCallback(
    (id: string, direction: 'up' | 'down') => {
      const currentIndex = filteredMembers.findIndex((m) => m.id === id);
      if (currentIndex < 0) return;

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= filteredMembers.length) return;

      const currentMember = filteredMembers[currentIndex];
      const targetMember = filteredMembers[targetIndex];

      const reorderedList = [...filteredMembers];
      reorderedList[currentIndex] = targetMember;
      reorderedList[targetIndex] = currentMember;

      // Assign spaced display order (10, 20, 30...)
      const updatedWithOrder = reorderedList.map((m, idx) => ({
        ...m,
        displayOrder: (idx + 1) * 10,
      }));

      // Update local state optimistically
      const orderMap = new Map(updatedWithOrder.map((m) => [m.id, m.displayOrder]));
      setMembers((prev) =>
        prev.map((m) => {
          const newOrder = orderMap.get(m.id);
          return newOrder !== undefined ? { ...m, displayOrder: newOrder } : m;
        })
      );
    },
    [filteredMembers]
  );

  const saveOrder = useCallback(async () => {
    setIsSavingOrder(true);
    try {
      const sorted = [...members].sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99));
      const payload = sorted.map((m, idx) => ({
        id: m.id,
        displayOrder: (idx + 1) * 10,
      }));
      const res = await reorderPeopleAction(payload);
      if (!res.success) {
        toast.error(`Failed to save order: ${res.error}`);
        return;
      }
      initialOrderRef.current = sorted.map((m) => m.id);
      setMembers(sorted.map((m, idx) => ({ ...m, displayOrder: (idx + 1) * 10 })));
      toast.success('People order saved successfully');
    } catch (err: any) {
      console.error('Failed to save people order:', err);
      toast.error('Failed to save order');
    } finally {
      setIsSavingOrder(false);
    }
  }, [members]);

  const resetOrder = useCallback(() => {
    if (!initialOrderRef.current || initialOrderRef.current.length === 0) return;
    const initialMap = new Map<string, number>(
      initialOrderRef.current.map((id: string, idx: number) => [id, (idx + 1) * 10])
    );
    setMembers((prev) =>
      [...prev]
        .map((m) => {
          const restoredOrder = initialMap.get(m.id);
          return {
            ...m,
            displayOrder: restoredOrder !== undefined ? restoredOrder : m.displayOrder,
          };
        })
        .sort((a, b) => (a.displayOrder ?? 99) - (b.displayOrder ?? 99))
    );
    toast.info('Reorder changes discarded');
  }, []);

  return {
    members,
    filteredMembers,
    searchTerm,
    setSearchTerm,
    classificationFilter,
    setClassificationFilter,
    visibilityFilter,
    setVisibilityFilter,
    tracks: useMemo(() => getTracks(), []),
    isLoading,
    refresh,
    saveMember,
    deleteMember,
    toggleDraft,
    moveMember,
    isOrderDirty,
    isSavingOrder,
    saveOrder,
    resetOrder,
  };
}
