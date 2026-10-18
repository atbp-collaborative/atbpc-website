/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserCheck, Shield, Check, Search, UserPlus } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Member, Role } from '@/types';
import { Button } from '@/components/primitives/buttons/Button';
import {
  memberHasRole,
  getCategoryBadgeClasses,
  getTrackBadgeClasses,
  formatCategoryLabel,
  formatTrackLabel,
} from '@/lib/roles/role-helpers';

interface AssignMemberRoleModalProps {
  isOpen: boolean;
  targetMember?: Member | null;
  targetRole?: Role | null;
  allMembers: Member[];
  allRoles: Role[];
  onSaveMemberRoles?: (memberId: string, roleIds: string[]) => void;
  onSaveRoleMembers?: (roleId: string, memberIds: string[]) => void;
  onClose: () => void;
}

export const AssignMemberRoleModal: React.FC<AssignMemberRoleModalProps> = ({
  isOpen,
  targetMember,
  targetRole,
  allMembers,
  allRoles,
  onSaveMemberRoles,
  onSaveRoleMembers,
  onClose,
}) => {
  const { isDarkMode } = useTheme();
  const [filterSearch, setFilterSearch] = useState('');

  // Selected state when managing roles for a member
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);

  // Selected state when managing members for a role
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  useEffect(() => {
    setFilterSearch('');

    if (targetMember) {
      // Find all roles held by this member
      const activeIds = allRoles
        .filter((r) => memberHasRole(targetMember, r))
        .map((r) => r.id);
      setSelectedRoleIds(activeIds);
    }

    if (targetRole) {
      // Find all members who hold this role
      const activeMemberIds = allMembers
        .filter((m) => memberHasRole(m, targetRole))
        .map((m) => m.id);
      setSelectedMemberIds(activeMemberIds);
    }
  }, [targetMember, targetRole, allRoles, allMembers, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const toggleRoleSelection = (roleId: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]
    );
  };

  const handleSave = () => {
    if (targetMember && onSaveMemberRoles) {
      onSaveMemberRoles(targetMember.id, selectedRoleIds);
    }
    if (targetRole && onSaveRoleMembers) {
      onSaveRoleMembers(targetRole.id, selectedMemberIds);
    }
    onClose();
  };

  const filteredRoles = useMemo(() => {
    const term = filterSearch.toLowerCase().trim();
    if (!term) return allRoles;
    return allRoles.filter(
      (r) =>
        r.title.toLowerCase().includes(term) ||
        (r.code && r.code.toLowerCase().includes(term)) ||
        (r.department && r.department.toLowerCase().includes(term))
    );
  }, [allRoles, filterSearch]);

  const filteredMembers = useMemo(() => {
    const term = filterSearch.toLowerCase().trim();
    if (!term) return allMembers;
    return allMembers.filter(
      (m) =>
        m.name.toLowerCase().includes(term) ||
        m.role.toLowerCase().includes(term) ||
        (m.license && m.license.toLowerCase().includes(term))
    );
  }, [allMembers, filterSearch]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full max-w-xl rounded-xl shadow-2xl border p-6 z-10 max-h-[85vh] flex flex-col ${
              isDarkMode
                ? 'bg-vintage-charcoal border-white/10 text-bright-gray'
                : 'bg-white border-black/10 text-vintage-charcoal'
            }`}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-black/10 dark:border-white/10 shrink-0">
              <div className="p-2.5 rounded-lg bg-space-sparkle/15 text-space-sparkle">
                {targetMember ? <Shield size={20} /> : <UserPlus size={20} />}
              </div>
              <div className="min-w-0 pr-6">
                <h3 className="text-body font-bold leading-snug truncate">
                  {targetMember
                    ? `Manage Roles: ${targetMember.name}`
                    : targetRole
                    ? `Assign Persons: ${targetRole.title}`
                    : 'Assign Roles'}
                </h3>
                <p className="text-micro opacity-60 truncate">
                  {targetMember
                    ? `Select all active roles held by ${targetMember.name}`
                    : targetRole
                    ? `Select all persons who currently hold the ${targetRole.title} role`
                    : ''}
                </p>
              </div>
            </div>

            {/* Search Filter */}
            <div className="pt-3 pb-2 shrink-0">
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"
                />
                <input
                  type="text"
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  placeholder={
                    targetMember ? 'Search roles by title or code...' : 'Search members by name...'
                  }
                  className={`w-full pl-9 pr-3 py-2 rounded-lg border text-caption outline-none transition-colors ${
                    isDarkMode
                      ? 'bg-vintage-charcoal/80 border-bright-gray/20 text-white placeholder-bright-gray/40 focus:border-space-sparkle'
                      : 'bg-white border-vintage-charcoal/20 text-vintage-charcoal placeholder-vintage-charcoal/40 focus:border-space-sparkle'
                  }`}
                />
              </div>
            </div>

            {/* List Selection Area */}
            <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1 min-h-[240px]">
              {targetMember ? (
                /* Role Selection Checklist */
                filteredRoles.map((role) => {
                  const isChecked = selectedRoleIds.includes(role.id);
                  const catClass = getCategoryBadgeClasses(role.category, isDarkMode);
                  const trackClass = getTrackBadgeClasses(role.track, isDarkMode);

                  return (
                    <div
                      key={role.id}
                      onClick={() => toggleRoleSelection(role.id)}
                      className={`p-3 rounded-lg border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isChecked
                          ? 'border-space-sparkle bg-space-sparkle/10'
                          : isDarkMode
                          ? 'border-white/10 bg-white/5 hover:border-white/20'
                          : 'border-black/10 bg-black/5 hover:border-black/20'
                      }`}
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          {role.code && (
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10 font-bold shrink-0">
                              {role.code}
                            </span>
                          )}
                          <span className="font-semibold text-caption truncate leading-snug">
                            {role.title}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full border ${catClass}`}>
                            {formatCategoryLabel(role.category)}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full border ${trackClass}`}>
                            {formatTrackLabel(role.track)}
                          </span>
                          {role.department && (
                            <span className="text-[10px] opacity-60 truncate max-w-[180px]">
                              {role.department}
                            </span>
                          )}
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-space-sparkle border-space-sparkle text-white'
                            : 'border-black/20 dark:border-white/20'
                        }`}
                      >
                        {isChecked && <Check size={13} strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Member Selection Checklist */
                filteredMembers.map((member) => {
                  const isChecked = selectedMemberIds.includes(member.id);

                  return (
                    <div
                      key={member.id}
                      onClick={() => toggleMemberSelection(member.id)}
                      className={`p-3 rounded-lg border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isChecked
                          ? 'border-space-sparkle bg-space-sparkle/10'
                          : isDarkMode
                          ? 'border-white/10 bg-white/5 hover:border-white/20'
                          : 'border-black/10 bg-black/5 hover:border-black/20'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-black/10 dark:border-white/10">
                          {member.image ? (
                            <Image
                              src={member.image}
                              alt={member.name}
                              fill
                              sizes="32px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-space-sparkle/20 flex items-center justify-center">
                              <UserCheck size={14} className="text-space-sparkle" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <div className="font-semibold text-caption leading-snug truncate">
                            {member.name}
                          </div>
                          <div className="text-micro opacity-60 truncate">
                            {member.role || 'No title set'}
                          </div>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-space-sparkle border-space-sparkle text-white'
                            : 'border-black/20 dark:border-white/20'
                        }`}
                      >
                        {isChecked && <Check size={13} strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10 shrink-0">
              <span className="text-micro font-mono opacity-60">
                {targetMember
                  ? `${selectedRoleIds.length} roles selected`
                  : `${selectedMemberIds.length} persons selected`}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="ghost"
                  onClick={onClose}
                  className="!py-2 !px-4 text-caption"
                  label="Cancel"
                />
                <Button
                  type="filled"
                  onClick={handleSave}
                  className="!py-2 !px-5 text-caption !bg-space-sparkle text-white"
                  label="Apply Assignments"
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
