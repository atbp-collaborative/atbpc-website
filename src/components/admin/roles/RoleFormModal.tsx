/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Save } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Role, RoleCategory, RoleTrack } from '@/types';
import { Button } from '@/components/primitives/buttons/Button';
import { formatCategoryLabel, formatTrackLabel } from '@/lib/roles/role-helpers';
import { getTracks } from '@/services/mock/adminMockStorage';

interface RoleFormModalProps {
  isOpen: boolean;
  role: Role | null;
  onSave: (role: Role) => void;
  onClose: () => void;
}

const EMPTY_ROLE: Role = {
  id: '',
  title: '',
  code: '',
  category: 'designers',
  track: 'professionals',
  trackId: 'PROF',
  department: '',
  description: '',
  isActive: true,
  isDraft: false,
};

export const RoleFormModal: React.FC<RoleFormModalProps> = ({
  isOpen,
  role,
  onSave,
  onClose,
}) => {
  const { isDarkMode } = useTheme();
  const tracks = useMemo(() => getTracks(), []);
  const [formData, setFormData] = useState<Role>(EMPTY_ROLE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (role) {
      setFormData({
        ...EMPTY_ROLE,
        ...role,
        trackId: role.trackId || (role.track === 'professionals' ? 'PROF' : 'INTERN_CHED_240'),
        isActive: role.isActive !== undefined ? role.isActive : !role.isDraft,
      });
    } else {
      setFormData({
        ...EMPTY_ROLE,
        id: 'role-' + Date.now(),
      });
    }
    setErrors({});
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
    onClose();
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
              {/* Role Title */}
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
                  placeholder="e.g. Senior Project Architect"
                  className={inputBaseClass}
                  autoFocus
                />
              </div>

              {/* Code & Department row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-caption font-semibold">
                    Role Code <span className="text-micro font-normal opacity-60">(e.g. HRDT-07)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. HRDT-07"
                    className={`${inputBaseClass} font-mono`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-caption font-semibold">Department / Team</label>
                  <input
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Production Team"
                    className={inputBaseClass}
                  />
                </div>
              </div>

              {/* Category & Track row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-caption font-semibold">
                    Category <span className="text-space-sparkle">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as RoleCategory })
                    }
                    className={inputBaseClass}
                  >
                    <option value="designers">Designers</option>
                    <option value="managers">Managers</option>
                    <option value="builders">Builders</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-caption font-semibold">
                    Studio Track <span className="text-space-sparkle">*</span>
                  </label>
                  <select
                    value={formData.trackId || 'PROF'}
                    onChange={(e) => {
                      const tId = e.target.value;
                      const matched = tracks.find((t) => t.id === tId);
                      setFormData({
                        ...formData,
                        trackId: tId,
                        track: matched && matched.trackType === 'professional' ? 'professionals' : 'internship',
                      });
                    }}
                    className={inputBaseClass}
                  >
                    {tracks.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Status Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-black/10 dark:border-white/10">
                <div>
                  <span className="text-caption font-semibold block">Role Status</span>
                  <span className="text-micro opacity-60">Control role availability across studio assignments</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: prev.isActive !== undefined ? !prev.isActive : false,
                      isDraft: prev.isActive !== undefined ? prev.isActive : true,
                    }))
                  }
                  className={`px-3 py-1.5 rounded-lg text-mini font-semibold uppercase tracking-wider transition-colors border cursor-pointer ${
                    formData.isActive !== false
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  }`}
                >
                  {formData.isActive !== false ? '● Active' : '○ Inactive / Draft'}
                </button>
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
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
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
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
