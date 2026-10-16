/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Member, MemberCategory } from '@/types';
import {
  getMembers,
  saveMember as saveMemberStorage,
  deleteMember as deleteMemberStorage,
  toggleMemberDraft as toggleMemberDraftStorage,
} from '@/services/mock/adminMockStorage';
import { toast } from 'sonner';

export type PeopleClassificationFilter = 'all' | MemberCategory;
export type VisibilityFilter = 'all' | 'published' | 'draft';

export function useAdminPeople() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [classificationFilter, setClassificationFilter] = useState<PeopleClassificationFilter>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>('all');
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setIsLoading(true);
    const data = getMembers();
    setMembers(data);
    setIsLoading(false);
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

  const saveMember = useCallback((memberData: Member) => {
    const saved = saveMemberStorage(memberData);
    setMembers((prev) => {
      const idx = prev.findIndex((m) => m.id === saved.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
    toast.success(`Member "${saved.name}" saved successfully`);
    return saved;
  }, []);

  const deleteMember = useCallback((id: string) => {
    const target = members.find((m) => m.id === id);
    deleteMemberStorage(id);
    setMembers((prev) => prev.filter((m) => m.id !== id));
    toast.success(`Member "${target?.name || id}" removed`);
  }, [members]);

  const toggleDraft = useCallback((id: string) => {
    const updated = toggleMemberDraftStorage(id);
    if (updated) {
      setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, isDraft: updated.isDraft } : m)));
      toast.info(`Member status set to ${updated.isDraft ? 'Draft' : 'Published'}`);
    }
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
    isLoading,
    refresh,
    saveMember,
    deleteMember,
    toggleDraft,
  };
}
