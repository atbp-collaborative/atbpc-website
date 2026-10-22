/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Save, Trash2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Role, RoleCategory, RoleTrack } from '@/types';
import { Button } from '@/components/primitives/buttons/Button';
import { getTracks } from '@/services/mock/adminMockStorage';

interface RoleFormModalProps {
  isOpen: boolean;
  role: Role | null;
  onSave: (role: Role) => void;
  onDelete?: (roleId: string) => void;
  onClose: () => void;
}

const EMPTY_ROLE: Role = {
  id: '',
  title: '',
  code: '',
  category: 'designers',
  track: 'professionals',
  trackId: 'PROF',
  description: '',
  role_visibility: 'public',
};

const CAREER_TRACK_OPTIONS = [
  { id: 'PROF', label: 'Professional Practice', trackType: 'professional' },
  { id: 'INTERN_CHED_240', label: '240-hr Curriculum-based Internship', trackType: 'internship' },
  { id: 'APPRENTICE_ALE_3840', label: '3840-hr Diversified Architectural Experience', trackType: 'apprenticeship' },
  { id: 'INTERN_VOC', label: 'Vocational', trackType: 'internship' },
];

export const RoleFormModal: React.FC<RoleFormModalProps> = ({
  isOpen,
  role,
  onSave,
  onDelete,
  onClose,
}) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState<Role>(EMPTY_ROLE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (role) {
      setFormData({
        ...EMPTY_ROLE,
        ...role,
        trackId: role.trackId || (role.track === 'professionals' ? 'PROF' : 'INTERN_CHED_240'),
        role_visibility: role.role_visibility || 'public',
      });
    } else {
      setFormData({
        ...EMPTY_ROLE,
        id: 'role-' + Date.now(),
      });
    }
    setErrors({});
    setIsConfirmingDelete(false);
  }, [role, isOpen]);

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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Role title is required';
    }
    if (!formData.code || !formData.code.trim()) {
      newErrors.code = 'Role code is required';
    }
    if (!formData.category) {
      newErrors.category = 'Role category is required';
    }
    if (!formData.trackId) {
      newErrors.trackId = 'Career track is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (role && onDelete) {
      onDelete(role.id);
      onClose();
    }
  };

  const inputBaseClass = `w-full px-3.5 py-2.5 rounded-lg border text-caption outline-none transition-colors ${
    isDarkMode
      ? 'bg-vintage-charcoal/80 border-bright-gray/20 text-white placeholder-bright-gray/40 focus:border-space-sparkle'
      : 'bg-white border-vintage-charcoal/20 text-vintage-charcoal placeholder-vintage-charcoal/40 focus:border-space-sparkle'
  }`;

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
            className={`relative w-full max-w-lg rounded-xl shadow-2xl border p-6 z-10 max-h-[90vh] overflow-y-auto ${
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

            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-black/10 dark:border-white/10">
              <div className="p-2.5 rounded-lg bg-space-sparkle/15 text-space-sparkle">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="text-body font-bold leading-snug">
                  {role ? 'Edit Role' : 'Create New Role'}
                </h3>
                <p className="text-micro opacity-60">
                  {role ? 'Update role properties and classification' : 'Add a new role to the studio catalog'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Title & Role Code row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-caption font-semibold flex items-center justify-between">
                    <span>Role Title <span className="text-space-sparkle">*</span></span>
                    {errors.title && (
                      <span className="text-micro text-red-500">{errors.title}</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Junior Designer"
                    className={inputBaseClass}
                    autoFocus
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-caption font-semibold flex items-center justify-between">
                    <span>Role Code <span className="text-space-sparkle">*</span></span>
                    {errors.code && (
                      <span className="text-micro text-red-500">{errors.code}</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="HRDT-01"
                    className={`${inputBaseClass} font-mono`}
                  />
                </div>
              </div>

              {/* Category & Career Track row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-caption font-semibold flex items-center justify-between">
                    <span>Role Category <span className="text-space-sparkle">*</span></span>
                    {errors.category && (
                      <span className="text-micro text-red-500">{errors.category}</span>
                    )}
                  </label>
                  <select
                    value={formData.category || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as RoleCategory })
                    }
                    className={inputBaseClass}
                  >
                    <option value="" disabled>
                      [ Select Role Category ]
                    </option>
                    <option value="designers">Designers</option>
                    <option value="managers">Managers</option>
                    <option value="builders">Builders</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-caption font-semibold flex items-center justify-between">
                    <span>Career Track <span className="text-space-sparkle">*</span></span>
                    {errors.trackId && (
                      <span className="text-micro text-red-500">{errors.trackId}</span>
                    )}
                  </label>
                  <select
                    value={formData.trackId || ''}
                    onChange={(e) => {
                      const tId = e.target.value;
                      const matched = CAREER_TRACK_OPTIONS.find((t) => t.id === tId);
                      setFormData({
                        ...formData,
                        trackId: tId,
                        track: matched && matched.trackType === 'professional' ? 'professionals' : 'internship',
                      });
                    }}
                    className={inputBaseClass}
                  >
                    <option value="" disabled>
                      [ Select Career Track ]
                    </option>
                    {CAREER_TRACK_OPTIONS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Role Visibility */}
              <div className="space-y-1">
                <label className="text-caption font-semibold flex items-center justify-between">
                  <span>Role Visibility</span>
                  <span className="text-micro opacity-60">Control dashboard / public exposure</span>
                </label>
                <select
                  value={formData.role_visibility || 'public'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role_visibility: e.target.value as any,
                    })
                  }
                  className={inputBaseClass}
                >
                  <option value="public">Public (Visible across public career pages and studio)</option>
                  <option value="editor">Editor (Internal role visible to Editors, Admins & Superadmin)</option>
                  <option value="admin">Admin (Operational role visible to Admins & Superadmin)</option>
                  <option value="superadmin">Superadmin (Confidential strictly to Superadmin console)</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-caption font-semibold">Role Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summarize key responsibilities, deliverables, or qualifications..."
                  className={inputBaseClass}
                />
              </div>

              {/* Modal footer actions */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                {/* Trash/Delete action inside edit modal */}
                {role && onDelete ? (
                  isConfirmingDelete ? (
                    <div className="flex items-center gap-2">
                      <span className="text-micro text-red-500 font-medium">Delete this role?</span>
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="px-2.5 py-1 text-micro rounded bg-red-600 text-white font-medium hover:bg-red-700 cursor-pointer"
                      >
                        Yes, Delete
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsConfirmingDelete(false)}
                        className="px-2 py-1 text-micro rounded border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsConfirmingDelete(true)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-caption text-red-500 hover:bg-red-500/10 border border-red-500/20 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} /> <span>Delete Role</span>
                    </button>
                  )
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-3">
                  <Button
                    type="ghost"
                    onClick={onClose}
                    className="!py-2 !px-4 text-caption"
                    label="Cancel"
                  />
                  <Button
                    type="filled"
                    htmlType="submit"
                    className="!py-2 !px-5 text-caption !bg-space-sparkle text-white"
                  >
                    <Save size={14} className="mr-1.5 inline" /> Save Role
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
