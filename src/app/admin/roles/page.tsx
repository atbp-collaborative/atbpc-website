/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { getRoles, getProjectRoles } from '@/services/mock/adminMockStorage';
import {
  fetchAdminPeopleAction,
  fetchAdminProjectsAction,
  fetchAdminRolesAction,
} from '@/app/actions/admin-mutations';
import { AdminRolesClient } from './AdminRolesClient';

export const revalidate = 60;

export default async function AdminRolesPage() {
  const [members, projects, dbRoles] = await Promise.all([
    fetchAdminPeopleAction().catch(() => []),
    fetchAdminProjectsAction().catch(() => []),
    fetchAdminRolesAction().catch(() => []),
  ]);

  const roles = dbRoles && dbRoles.length > 0 ? dbRoles : getRoles();
  const projectRoles = getProjectRoles();

  return (
    <AdminRolesClient
      initialData={{
        roles,
        projectRoles,
        members,
        projects,
      }}
    />
  );
}
