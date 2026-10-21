/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { fetchAdminProjectsAction } from '@/app/actions/admin-mutations';
import { getProjectRolesFromSupabase } from '@/services/supabase/project-roles.service';
import { AdminProjectsClient } from './AdminProjectsClient';

export const revalidate = 60;

export default async function AdminProjectsPage() {
  const [projects, roles] = await Promise.all([
    fetchAdminProjectsAction().catch(() => []),
    getProjectRolesFromSupabase().catch(() => []),
  ]);

  return <AdminProjectsClient initialProjects={projects} initialRoles={roles} />;
}
