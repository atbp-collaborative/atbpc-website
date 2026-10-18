/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Shield, Users, FolderKanban, RotateCcw } from 'lucide-react';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Button } from '@/components/primitives/buttons/Button';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { useAdminRoles, ProjectRoleEntry } from '@/hooks/admin/useAdminRoles';
import { RolesFilterBar } from '@/components/admin/roles/RolesFilterBar';
import { RolesViewTabs, RolesViewMode } from '@/components/admin/roles/RolesViewTabs';
import { RolesByRoleTable } from '@/components/admin/roles/RolesByRoleTable';
import { RolesByPersonTable } from '@/components/admin/roles/RolesByPersonTable';
import { RolesProjectTable } from '@/components/admin/roles/RolesProjectTable';
import { RoleFormModal } from '@/components/admin/roles/RoleFormModal';
import { AssignMemberRoleModal } from '@/components/admin/roles/AssignMemberRoleModal';
import { ProjectRoleModal } from '@/components/admin/roles/ProjectRoleModal';
import { Role, Member } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { memberHasRole } from '@/lib/roles/role-helpers';

export default function AdminRolesPage() {
  const { isDarkMode } = useTheme();

  const {
    roles,
    filteredRoles,
    members,
    filteredMembers,
    projects,
    projectRoleEntries,
    isLoading,
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    trackFilter,
    setTrackFilter,
    selectedProjectId,
    setSelectedProjectId,
    saveRole,
    deleteRole,
    setMemberRoles,
    associateMemberToProject,
    disassociateMemberFromProject,
  } = useAdminRoles();

  // Active view tab: 'roles' | 'persons' | 'projects'
  const [viewMode, setViewMode] = useState<RolesViewMode>('roles');

  // Modal states: Role Form
  const [isRoleFormOpen, setIsRoleFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Modal states: Assign Members / Roles
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [targetMemberForAssign, setTargetMemberForAssign] = useState<Member | null>(null);
  const [targetRoleForAssign, setTargetRoleForAssign] = useState<Role | null>(null);

  // Modal states: Project Role
  const [isProjectRoleModalOpen, setIsProjectRoleModalOpen] = useState(false);
  const [editingProjectRoleEntry, setEditingProjectRoleEntry] = useState<ProjectRoleEntry | null>(null);

  // Modal states: Deletion confirmation
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [projectRoleToDelete, setProjectRoleToDelete] = useState<ProjectRoleEntry | null>(null);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      all: roles.length,
      designers: roles.filter((r) => r.category === 'designers').length,
      managers: roles.filter((r) => r.category === 'managers').length,
      builders: roles.filter((r) => r.category === 'builders').length,
    };
  }, [roles]);

  // Track counts
  const trackCounts = useMemo(() => {
    return {
      all: roles.length,
      professionals: roles.filter((r) => r.track === 'professionals').length,
      internship: roles.filter((r) => r.track === 'internship').length,
    };
  }, [roles]);

  // Role Form Handlers
  const handleOpenCreateRole = () => {
    setEditingRole(null);
    setIsRoleFormOpen(true);
  };

  const handleOpenEditRole = (role: Role) => {
    setEditingRole(role);
    setIsRoleFormOpen(true);
  };

  // Member Assignment Handlers
  const handleOpenAssignForRole = (role: Role) => {
    setTargetRoleForAssign(role);
    setTargetMemberForAssign(null);
    setIsAssignModalOpen(true);
  };

  const handleOpenAssignForMember = (member: Member) => {
    setTargetMemberForAssign(member);
    setTargetRoleForAssign(null);
    setIsAssignModalOpen(true);
  };

  const handleSaveRoleMembers = (roleId: string, memberIds: string[]) => {
    // For each member, update whether they hold this role
    for (const member of members) {
      const currentRoles = member.roles || [];
      const hasCurrently = currentRoles.includes(roleId);
      const shouldHave = memberIds.includes(member.id);

      if (hasCurrently && !shouldHave) {
        setMemberRoles(
          member.id,
          currentRoles.filter((id) => id !== roleId)
        );
      } else if (!hasCurrently && shouldHave) {
        setMemberRoles(member.id, [...currentRoles, roleId]);
      }
    }
  };

  // Project Role Handlers
  const handleOpenAddProjectRole = () => {
    setEditingProjectRoleEntry(null);
    setIsProjectRoleModalOpen(true);
  };

  const handleOpenEditProjectRole = (entry: ProjectRoleEntry) => {
    setEditingProjectRoleEntry(entry);
    setIsProjectRoleModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <AdminHeader
        title="manage roles"
        breadcrumbs={[{ label: 'Admin' }, { label: 'Manage Roles' }]}
        actions={
          <Button
            type="filled"
            onClick={handleOpenCreateRole}
            className="!py-2 !px-4 text-caption !bg-space-sparkle text-white"
          >
            <Plus size={16} className="mr-1.5 inline" /> New Role
          </Button>
        }
      />

      <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Quick Summary Pill Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10'
            }`}
          >
            <div>
              <span className="text-micro font-mono uppercase tracking-wider opacity-60 block">
                Total Roles
              </span>
              <span className="text-h2 font-major font-bold">{roles.length}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-space-sparkle/15 text-space-sparkle">
              <Shield size={20} />
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10'
            }`}
          >
            <div>
              <span className="text-micro font-mono uppercase tracking-wider opacity-60 block">
                Active Members
              </span>
              <span className="text-h2 font-major font-bold">{members.length}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-500/15 text-amber-500">
              <Users size={20} />
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10'
            }`}
          >
            <div>
              <span className="text-micro font-mono uppercase tracking-wider opacity-60 block">
                Project Assignments
              </span>
              <span className="text-h2 font-major font-bold">{projectRoleEntries.length}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-purple-500/15 text-purple-400">
              <FolderKanban size={20} />
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-white border-black/10'
            }`}
          >
            <div>
              <span className="text-micro font-mono uppercase tracking-wider opacity-60 block">
                Interns & Apprentices
              </span>
              <span className="text-h2 font-major font-bold">
                {roles.filter((r) => r.track === 'internship').length}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/15 text-emerald-500">
              <Shield size={20} />
            </div>
          </div>
        </div>

        {/* Filter Bar (Category, Track, Search) */}
        <RolesFilterBar
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          trackFilter={trackFilter}
          setTrackFilter={setTrackFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryCounts={categoryCounts}
          trackCounts={trackCounts}
        />

        {/* View Mode Tabs (By Role, By Person, Project Roles) */}
        <RolesViewTabs
          viewMode={viewMode}
          setViewMode={setViewMode}
          rolesCount={filteredRoles.length}
          personsCount={filteredMembers.length}
          projectRolesCount={projectRoleEntries.length}
        />

        {/* Active View Table Content */}
        {isLoading ? (
          <div className="p-12 text-center text-caption opacity-60">
            Loading roles directory...
          </div>
        ) : (
          <>
            {viewMode === 'roles' && (
              <RolesByRoleTable
                roles={filteredRoles}
                allMembers={members}
                onEditRole={handleOpenEditRole}
                onDeleteRole={(role) => setRoleToDelete(role)}
                onAssignPersons={handleOpenAssignForRole}
              />
            )}

            {viewMode === 'persons' && (
              <RolesByPersonTable
                members={filteredMembers}
                allRoles={roles}
                onManageMemberRoles={handleOpenAssignForMember}
              />
            )}

            {viewMode === 'projects' && (
              <RolesProjectTable
                entries={projectRoleEntries}
                projects={projects}
                selectedProjectId={selectedProjectId}
                setSelectedProjectId={setSelectedProjectId}
                onAddProjectRole={handleOpenAddProjectRole}
                onEditProjectRole={handleOpenEditProjectRole}
                onRemoveProjectRole={(entry) => setProjectRoleToDelete(entry)}
              />
            )}
          </>
        )}
      </div>

      {/* Role Create/Edit Modal */}
      <RoleFormModal
        isOpen={isRoleFormOpen}
        role={editingRole}
        onSave={saveRole}
        onClose={() => setIsRoleFormOpen(false)}
      />

      {/* Assign Member / Roles Modal */}
      <AssignMemberRoleModal
        isOpen={isAssignModalOpen}
        targetMember={targetMemberForAssign}
        targetRole={targetRoleForAssign}
        allMembers={members}
        allRoles={roles}
        onSaveMemberRoles={setMemberRoles}
        onSaveRoleMembers={handleSaveRoleMembers}
        onClose={() => setIsAssignModalOpen(false)}
      />

      {/* Project Role Modal */}
      <ProjectRoleModal
        isOpen={isProjectRoleModalOpen}
        entry={editingProjectRoleEntry}
        projects={projects}
        members={members}
        allRoles={roles}
        onSave={associateMemberToProject}
        onClose={() => setIsProjectRoleModalOpen(false)}
      />

      {/* Confirm Modal: Delete Role */}
      <ConfirmModal
        isOpen={Boolean(roleToDelete)}
        title="Delete Role"
        description={`Are you sure you want to delete the role "${roleToDelete?.title}"? Any assigned members will have this role removed from their profiles.`}
        confirmLabel="Delete Role"
        isDestructive={true}
        onConfirm={() => {
          if (roleToDelete) {
            deleteRole(roleToDelete.id);
            setRoleToDelete(null);
          }
        }}
        onCancel={() => setRoleToDelete(null)}
      />

      {/* Confirm Modal: Remove Project Role Assignment */}
      <ConfirmModal
        isOpen={Boolean(projectRoleToDelete)}
        title="Remove Project Role"
        description={`Are you sure you want to remove ${projectRoleToDelete?.memberName}'s involvement as "${projectRoleToDelete?.roleInProject}" from ${projectRoleToDelete?.projectTitle}?`}
        confirmLabel="Remove Assignment"
        isDestructive={true}
        onConfirm={() => {
          if (projectRoleToDelete) {
            disassociateMemberFromProject(
              projectRoleToDelete.memberId,
              projectRoleToDelete.projectId
            );
            setProjectRoleToDelete(null);
          }
        }}
        onCancel={() => setProjectRoleToDelete(null)}
      />
    </div>
  );
}
