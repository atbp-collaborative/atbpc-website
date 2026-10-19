/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
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
} from '@/app/actions/admin-mutations';
import { toast } from 'sonner';

export type PeopleClassificationFilter = 'all' | MemberCategory;
export type VisibilityFilter = 'all' | 'published' | 'draft';

export function useAdminPeople() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [classificationFilter, setClassificationFilter] = useState<PeopleClassificationFilter>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getMembersFromDataService(true);
      setMembers(data);

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
    refresh();
  }, [refresh]);

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
  };
}
