/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, FolderKanban, Save } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Project, Member, Role } from '@/types';
import { ProjectRoleEntry } from '@/hooks/admin/useAdminRoles';
import { Button } from '@/components/primitives/buttons/Button';
import {
  MAIN_CATEGORIES,
  TYPOLOGY_MAP,
  getTypologiesForCategory,
} from '@/lib/projects/project-constants';
import { getRoles } from '@/services/mock/adminMockStorage';

interface ProjectRoleModalProps {
  isOpen: boolean;
  entry: ProjectRoleEntry | null;
  projects: Project[];
  members: Member[];
  allRoles?: Role[];
  onSave: (memberId: string, projectId: string, roleInProject: string, description: string) => void;
  onClose: () => void;
}

export const ProjectRoleModal: React.FC<ProjectRoleModalProps> = ({
  isOpen,
  entry,
  projects,
  members,
  allRoles,
  onSave,
  onClose,
}) => {
  const { isDarkMode } = useTheme();

  // Cascading project selection
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTypology, setSelectedTypology] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');

  // Member & Role state
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const rolesList = useMemo(() => {
    return allRoles && allRoles.length > 0 ? allRoles : getRoles();
  }, [allRoles]);

  const designerRoles = useMemo(
    () => rolesList.filter((r) => r.category === 'designers'),
    [rolesList]
  );
  const managerRoles = useMemo(
    () => rolesList.filter((r) => r.category === 'managers'),
    [rolesList]
  );
  const builderRoles = useMemo(
    () => rolesList.filter((r) => r.category === 'builders'),
    [rolesList]
  );

  const availableTypologies = useMemo(() => {
    return getTypologiesForCategory(selectedCategory);
  }, [selectedCategory]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const projCat =
        p.mainCategory ||
        Object.keys(TYPOLOGY_MAP).find((cat) =>
          TYPOLOGY_MAP[cat].includes(p.category) ||
          (p.subcategory && TYPOLOGY_MAP[cat].includes(p.subcategory))
        ) ||
        '';

      if (
        selectedCategory &&
        selectedCategory !== 'all' &&
        projCat.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      const projTyp = p.subcategory || p.category || '';
      if (
        selectedTypology &&
        selectedTypology !== 'all' &&
        projTyp.toLowerCase() !== selectedTypology.toLowerCase()
      ) {
        return false;
      }

      return true;
    });
  }, [projects, selectedCategory, selectedTypology]);

  useEffect(() => {
    if (entry) {
      setSelectedProjectId(entry.projectId);
      setSelectedMemberId(entry.memberId);
      const isKnown = rolesList.some((r) => r.title === entry.roleInProject);
      if (isKnown) {
        setSelectedRoleId(entry.roleInProject);
        setCustomRole('');
      } else {
        setSelectedRoleId('__custom__');
        setCustomRole(entry.roleInProject);
      }
      setDescription(entry.description || '');

      // Infer project category and typology if entry exists
      const proj = projects.find((p) => p.id === entry.projectId);
      if (proj) {
        setSelectedCategory(proj.mainCategory || '');
        setSelectedTypology(proj.subcategory || proj.category || '');
      }
    } else {
      setSelectedCategory('');
      setSelectedTypology('');
      setSelectedProjectId(projects[0]?.id || '');
      setSelectedMemberId(members[0]?.id || '');
      setSelectedRoleId('');
      setCustomRole('');
      setDescription('');
    }
    setErrors({});
  }, [entry, projects, members, rolesList, isOpen]);

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
    if (!selectedProjectId) newErrors.project = 'Please select a project';
    if (!selectedMemberId) newErrors.member = 'Please select a team member';
    if (!selectedRoleId) {
      newErrors.role = 'Role in project is required';
    } else if (selectedRoleId === '__custom__' && !customRole.trim()) {
      newErrors.role = 'Please specify a custom role title';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let roleTitle = 'Contributor';
    if (selectedRoleId === '__custom__') {
      roleTitle = customRole.trim() || 'Contributor';
    } else if (selectedRoleId) {
      const foundRole = rolesList.find((r) => r.id === selectedRoleId || r.title === selectedRoleId);
      roleTitle = foundRole ? foundRole.title : selectedRoleId;
    }

    onSave(selectedMemberId, selectedProjectId, roleTitle, description.trim());
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
                <FolderKanban size={20} />
              </div>
              <div>
                <h3 className="text-body font-bold leading-snug">
                  {entry ? 'Edit Project Role' : 'Assign Member to Project'}
                </h3>
                <p className="text-micro opacity-60">
                  {entry
                    ? `Update ${entry.memberName}'s role in ${entry.projectTitle}`
                    : 'Designate a team member to a project with a specific project role'}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category & Typology Selectors (disabled if editing existing entry) */}
              {!entry && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-micro uppercase tracking-wider block opacity-70">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setSelectedTypology('');
                      }}
                      className={inputBaseClass}
                    >
                      <option value="">-- All Categories --</option>
                      {MAIN_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-micro uppercase tracking-wider block opacity-70">
                      Typology
                    </label>
                    <select
                      value={selectedTypology}
                      onChange={(e) => setSelectedTypology(e.target.value)}
                      className={inputBaseClass}
                    >
                      <option value="">-- All Typologies --</option>
                      {availableTypologies.map((typ) => (
                        <option key={typ} value={typ}>
                          {typ}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Project selector */}
              <div className="space-y-1">
                <label className="text-caption font-semibold flex items-center justify-between">
                  <span>
                    Project <span className="text-space-sparkle">*</span>
                  </span>
                  {errors.project && (
                    <span className="text-micro text-red-500">{errors.project}</span>
                  )}
                </label>
                <select
                  disabled={Boolean(entry)}
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className={`${inputBaseClass} ${entry ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <option value="">-- Choose Project ({filteredProjects.length}) --</option>
                  {filteredProjects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.title} ({proj.year || proj.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Person selector */}
              <div className="space-y-1">
                <label className="text-caption font-semibold flex items-center justify-between">
                  <span>
                    Team Member <span className="text-space-sparkle">*</span>
                  </span>
                  {errors.member && (
                    <span className="text-micro text-red-500">{errors.member}</span>
                  )}
                </label>
                <select
                  disabled={Boolean(entry)}
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className={`${inputBaseClass} ${entry ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.role || 'Member'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Role in Project (from Manage Roles) */}
              <div className="space-y-1">
                <label className="text-caption font-semibold flex items-center justify-between">
                  <span>
                    Role in Project <span className="text-space-sparkle">*</span>
                  </span>
                  {errors.role && (
                    <span className="text-micro text-red-500">{errors.role}</span>
                  )}
                </label>
                <select
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  className={inputBaseClass}
                >
                  <option value="">-- Choose Role from Manage Roles --</option>
                  {designerRoles.length > 0 && (
                    <optgroup label="Designers">
                      {designerRoles.map((r) => (
                        <option key={r.id} value={r.title}>
                          {r.title}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {managerRoles.length > 0 && (
                    <optgroup label="Managers">
                      {managerRoles.map((r) => (
                        <option key={r.id} value={r.title}>
                          {r.title}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  {builderRoles.length > 0 && (
                    <optgroup label="Builders">
                      {builderRoles.map((r) => (
                        <option key={r.id} value={r.title}>
                          {r.title}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  <option value="__custom__">✍️ Other / Custom Role...</option>
                </select>
              </div>

              {selectedRoleId === '__custom__' && (
                <div className="space-y-1">
                  <label className="text-micro font-semibold uppercase tracking-wider block opacity-70">
                    Custom Role Title <span className="text-space-sparkle">*</span>
                  </label>
                  <input
                    type="text"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="e.g. Lead Principal Architect, Site Foreman, Design Consultant"
                    className={inputBaseClass}
                    autoFocus
                  />
                </div>
              )}

              {/* Scope & Description */}
              <div className="space-y-1">
                <label className="text-caption font-semibold">Scope & Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details of their specific responsibilities, deliverables, or site presence..."
                  className={inputBaseClass}
                />
              </div>

              {/* Footer */}
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
                  <Save size={14} className="mr-1.5 inline" /> Save Assignment
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
