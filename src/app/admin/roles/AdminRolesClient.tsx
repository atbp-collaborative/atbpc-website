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
import { useAdminRoles, AdminRolesInitialData } from '@/hooks/admin/useAdminRoles';
import { RolesFilterBar } from '@/components/admin/roles/RolesFilterBar';
import { RolesViewTabs, RolesViewMode } from '@/components/admin/roles/RolesViewTabs';
import { RolesByRoleTable } from '@/components/admin/roles/RolesByRoleTable';
import { RolesByPersonTable } from '@/components/admin/roles/RolesByPersonTable';
import { RolesByProjectRoleTable } from '@/components/admin/roles/RolesByProjectRoleTable';
import { useAdminAuth } from '@/hooks/admin/useAdminAuth';
import { RoleFormModal } from '@/components/admin/roles/RoleFormModal';
import { AssignMemberRoleModal } from '@/components/admin/roles/AssignMemberRoleModal';
import { ProjectRoleFormModal } from '@/components/admin/roles/ProjectRoleFormModal';
import { PersonInvolvementsModal } from '@/components/admin/roles/PersonInvolvementsModal';
import { Role, Member, ProjectRole } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { memberHasRole, detectIntelligentRolesViewMode } from '@/lib/roles/role-helpers';

interface AdminRolesClientProps {
  initialData?: AdminRolesInitialData;
}

export function AdminRolesClient({ initialData }: AdminRolesClientProps) {
  const { isDarkMode } = useTheme();
  const { user } = useAdminAuth();

  const {
    roles,
    filteredRoles,
    projectRoles,
    filteredProjectRoles,
    members,
    filteredMembers,
    projects,
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
    saveProjectRole,
    deleteProjectRole,
    setMemberRoles,
    associateMemberToProject,
    disassociateMemberFromProject,
    saveMemberInvolvements,
  } = useAdminRoles(initialData);

  // Active view tab: 'roles' | 'persons' | 'project-roles'
  const [viewMode, setViewMode] = useState<RolesViewMode>('roles');

  // Modal states: Role Form
  const [isRoleFormOpen, setIsRoleFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Modal states: Assign Members / Roles
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [targetMemberForAssign, setTargetMemberForAssign] = useState<Member | null>(null);
  const [targetRoleForAssign, setTargetRoleForAssign] = useState<Role | null>(null);

  // Modal states: Person Involvements
  const [involvementMember, setInvolvementMember] = useState<Member | null>(null);

  // Modal states: Project Role Form
  const [isProjectRoleFormOpen, setIsProjectRoleFormOpen] = useState(false);
  const [editingProjectRole, setEditingProjectRole] = useState<ProjectRole | null>(null);

  // Modal states: Deletion confirmation
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  // Category counts (dynamically reflects the currently selected career track)
  const categoryCounts = useMemo(() => {
    const rolesInTrack = trackFilter === 'all'
      ? roles
      : roles.filter((r) => r.track === trackFilter);

    return {
      all: rolesInTrack.length,
      designers: rolesInTrack.filter((r) => r.category === 'designers').length,
      managers: rolesInTrack.filter((r) => r.category === 'managers').length,
      builders: rolesInTrack.filter((r) => r.category === 'builders').length,
    };
  }, [roles, trackFilter]);

  // Track counts (dynamically reflects the currently selected role category)
  const trackCounts = useMemo(() => {
    const rolesInCategory = categoryFilter === 'all'
      ? roles
      : roles.filter((r) => r.category === categoryFilter);

    return {
      all: rolesInCategory.length,
      professionals: rolesInCategory.filter((r) => r.track === 'professionals').length,
      internship: rolesInCategory.filter((r) => r.track === 'internship').length,
    };
  }, [roles, categoryFilter]);

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

  const handleSaveRoleMembers = async (roleId: string, memberIds: string[]) => {
    for (const member of members) {
      const currentRoles = member.roles || [];
      const hasCurrently = currentRoles.includes(roleId);
      const shouldHave = memberIds.includes(member.id);

      if (hasCurrently && !shouldHave) {
        await setMemberRoles(
          member.id,
          currentRoles.filter((id) => id !== roleId)
        );
      } else if (!hasCurrently && shouldHave) {
        await setMemberRoles(member.id, [...currentRoles, roleId]);
      }
    }
  };

  // Search input handler with intelligent auto-tab switching
  const handleSearchTermChange = (term: string) => {
    setSearchTerm(term);
    if (!term.trim()) return;

    const detected = detectIntelligentRolesViewMode(
      term,
      roles,
      members,
      projectRoles
    );
    if (detected && detected !== viewMode) {
      setViewMode(detected as RolesViewMode);
    }
  };

  // Project Role Form Handlers
  const handleOpenAddProjectRole = () => {
    setEditingProjectRole(null);
    setIsProjectRoleFormOpen(true);
  };

  const handleOpenEditProjectRole = (projectRole: ProjectRole) => {
    setEditingProjectRole(projectRole);
    setIsProjectRoleFormOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Roles & Responsibilities"
        breadcrumbs={[{ label: 'Admin', href: '/admin/dashboard' }, { label: 'Roles' }]}
        actions={
          viewMode === 'project-roles' ? (
            <Button
              type="filled"
              onClick={handleOpenAddProjectRole}
              className="text-mini px-4 py-2 font-semibold"
            >
              <Plus size={15} className="mr-1.5 inline" /> Add Project Role
            </Button>
          ) : (
            <Button
              type="filled"
              onClick={handleOpenCreateRole}
              className="text-mini px-4 py-2 font-semibold"
            >
              <Plus size={15} className="mr-1.5 inline" /> Create Role
            </Button>
          )
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
                Project Roles
              </span>
              <span className="text-h2 font-major font-bold">{projectRoles.length}</span>
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
          setSearchTerm={handleSearchTermChange}
          categoryCounts={categoryCounts}
          trackCounts={trackCounts}
        />

        {/* View Mode Tabs (By Role, By Person, By Project Role) */}
        <RolesViewTabs
          viewMode={viewMode}
          setViewMode={setViewMode}
          rolesCount={filteredRoles.length}
          personsCount={filteredMembers.length}
          projectRolesCount={filteredProjectRoles.length}
        />

        {/* Active View Table Content */}
        {isLoading ? (
          <div className="rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 divide-y divide-black/5 dark:divide-white/5 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4 sm:p-5 h-16" />
            ))}
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
                onSelectPerson={setInvolvementMember}
              />
            )}

            {viewMode === 'project-roles' && (
              <RolesByProjectRoleTable
                projectRoles={filteredProjectRoles}
                members={members}
                onAddProjectRole={handleOpenAddProjectRole}
                onEditProjectRole={handleOpenEditProjectRole}
                onSelectPerson={setInvolvementMember}
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
        onDelete={deleteRole}
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

      {/* Person Project Involvements Modal */}
      <PersonInvolvementsModal
        isOpen={Boolean(involvementMember)}
        member={involvementMember}
        allProjects={projects}
        onSave={async (memberId, involvements) => {
          await saveMemberInvolvements(memberId, involvements);
          setInvolvementMember(null);
        }}
        onClose={() => setInvolvementMember(null)}
      />

      {/* Project Role Create/Edit Modal */}
      <ProjectRoleFormModal
        isOpen={isProjectRoleFormOpen}
        projectRole={editingProjectRole}
        onSave={saveProjectRole}
        onDelete={deleteProjectRole}
        onClose={() => setIsProjectRoleFormOpen(false)}
      />

      {/* Confirm Modal: Delete Role (Safeguard) */}
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
    </div>
  );
}
