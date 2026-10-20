/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserCheck, Briefcase, Save } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Member, Project, MemberInvolvement } from '@/types';
import { Button } from '@/components/primitives/buttons/Button';
import { MemberInvolvementManager } from '@/components/admin/MemberInvolvementManager';

interface PersonInvolvementsModalProps {
  isOpen: boolean;
  member: Member | null;
  allProjects: Project[];
  onSave: (memberId: string, involvements: MemberInvolvement[]) => Promise<void> | void;
  onClose: () => void;
}

export const PersonInvolvementsModal: React.FC<PersonInvolvementsModalProps> = ({
  isOpen,
  member,
  allProjects,
  onSave,
  onClose,
}) => {
  const { isDarkMode } = useTheme();
  const [localInvolvements, setLocalInvolvements] = useState<MemberInvolvement[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (member) {
      setLocalInvolvements(member.involvement || []);
    } else {
      setLocalInvolvements([]);
    }
    setIsSaving(false);
  }, [member, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSaving) onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isSaving]);

  if (!isOpen || !member) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(member.id, localInvolvements);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !isSaving && onClose()}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className={`relative w-full max-w-3xl max-h-[90vh] rounded-2xl border p-6 shadow-2xl flex flex-col z-10 ${
            isDarkMode
              ? 'bg-vintage-charcoal border-white/10 text-white'
              : 'bg-white border-black/10 text-vintage-charcoal'
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-black/10 dark:border-white/10 shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-black/10 dark:border-white/10">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-space-sparkle/20 flex items-center justify-center">
                    <UserCheck size={20} className="text-space-sparkle" />
                  </div>
                )}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-body font-bold leading-tight">{member.name}</h3>
                  {member.pseudonym && (
                    <span className="text-micro px-2 py-0.5 rounded-full bg-space-sparkle/15 text-space-sparkle font-medium">
                      &quot;{member.pseudonym}&quot;
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-caption opacity-70">
                  <Briefcase size={13} className="shrink-0" />
                  <span>{member.role || 'Team Member'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => !isSaving && onClose()}
              className="p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Subtitle / Help text */}
          <div className="pt-3 pb-2 text-micro opacity-60">
            Manage project involvements and contributor roles assigned to this team member.
          </div>

          {/* Content / Scrollable Body */}
          <div className="flex-1 overflow-y-auto py-2 pr-1 space-y-4">
            <MemberInvolvementManager
              involvements={localInvolvements}
              allProjects={allProjects}
              onChange={setLocalInvolvements}
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10 shrink-0">
            <span className="text-micro font-mono opacity-60">
              {localInvolvements.length} {localInvolvements.length === 1 ? 'project' : 'projects'} assigned
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="ghost"
                onClick={onClose}
                disabled={isSaving}
                className="!py-2 !px-4 text-caption"
                label="Cancel"
              />
              <Button
                type="filled"
                onClick={handleSave}
                disabled={isSaving}
                className="!py-2 !px-5 text-caption !bg-space-sparkle text-white font-medium"
              >
                <Save size={14} className="mr-1.5 inline" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
