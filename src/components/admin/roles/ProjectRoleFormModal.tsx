/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Briefcase, Save, Trash2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { ProjectRole } from '@/types';
import { Button } from '@/components/primitives/buttons/Button';

interface ProjectRoleFormModalProps {
  isOpen: boolean;
  projectRole: ProjectRole | null;
  onSave: (role: ProjectRole) => void;
  onDelete?: (roleId: string) => void;
  onClose: () => void;
}

const EMPTY_PROJECT_ROLE: ProjectRole = {
  id: '',
  code: '',
  name: '',
  description: '',
  isActive: true,
};

export const ProjectRoleFormModal: React.FC<ProjectRoleFormModalProps> = ({
  isOpen,
  projectRole,
  onSave,
  onDelete,
  onClose,
}) => {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState<ProjectRole>(EMPTY_PROJECT_ROLE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (projectRole) {
      setFormData({
        ...EMPTY_PROJECT_ROLE,
        ...projectRole,
        isActive: projectRole.isActive !== false,
      });
    } else {
      setFormData({
        ...EMPTY_PROJECT_ROLE,
        id: 'proj-role-' + Date.now(),
      });
    }
    setErrors({});
    setIsConfirmingDelete(false);
  }, [projectRole, isOpen]);

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
    if (!formData.name.trim()) {
      newErrors.name = 'Project role name is required';
    }
    if (!formData.code.trim()) {
      newErrors.code = 'Project role code is required';
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
    if (projectRole && onDelete) {
      onDelete(projectRole.id);
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
                <Briefcase size={20} />
              </div>
              <div>
                <h3 className="text-body font-bold leading-snug">
                  {projectRole ? 'Edit Project Role' : 'Create New Project Role'}
                </h3>
                <p className="text-micro opacity-60">
                  {projectRole
                    ? 'Update project role details and active classification'
                    : 'Define a new standardized scope role for project assignments'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Name */}
              <div className="space-y-1">
                <label className="text-caption font-semibold flex items-center justify-between">
                  <span>
                    Project Role Name <span className="text-space-sparkle">*</span>
                  </span>
                  {errors.name && (
                    <span className="text-micro text-red-500">{errors.name}</span>
                  )}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Architectural Design"
                  className={inputBaseClass}
                  autoFocus
                />
              </div>

              {/* Role Code */}
              <div className="space-y-1">
                <label className="text-caption font-semibold flex items-center justify-between">
                  <span>
                    Role Code <span className="text-space-sparkle">*</span>
                  </span>
                  {errors.code && (
                    <span className="text-micro text-red-500">{errors.code}</span>
                  )}
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g. PR-ARCH"
                  className={`${inputBaseClass} font-mono`}
                />
              </div>

              {/* Active Status Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-black/10 dark:border-white/10">
                <div>
                  <span className="text-caption font-semibold block">Role Status</span>
                  <span className="text-micro opacity-60">
                    Control availability across project team involvement dropdowns
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      isActive: !prev.isActive,
                    }))
                  }
                  className={`px-3 py-1.5 rounded-lg text-mini font-semibold uppercase tracking-wider transition-colors border cursor-pointer ${
                    formData.isActive !== false
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  }`}
                >
                  {formData.isActive !== false ? '● Active' : '○ Inactive'}
                </button>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-caption font-semibold">Role Scope & Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail scope responsibilities, typical deliverables, or specialization requirements..."
                  className={inputBaseClass}
                />
              </div>

              {/* Modal footer actions */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-black/10 dark:border-white/10">
                {/* Trash/Delete action inside edit modal */}
                {projectRole && onDelete ? (
                  isConfirmingDelete ? (
                    <div className="flex items-center gap-2">
                      <span className="text-micro text-red-500 font-medium">Delete role?</span>
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
                    <Save size={14} className="mr-1.5 inline" /> Save Project Role
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
