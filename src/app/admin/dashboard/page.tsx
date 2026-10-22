/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { fetchAdminPeopleAction, fetchAdminProjectsAction } from '@/app/actions/admin-mutations';
import { getRoles } from '@/services/mock/adminMockStorage';
import {
  getContactInfoFromSupabase,
  getPrivacyPolicyFromSupabase,
  getLegalNoticesFromSupabase,
} from '@/services/supabase/settings.service';
import { AdminDashboardClient } from './AdminDashboardClient';

export const revalidate = 60;

export default async function AdminDashboardPage() {
  const [members, projects, contactInfo, privacyPolicy, legalNotices] = await Promise.all([
    fetchAdminPeopleAction().catch(() => []),
    fetchAdminProjectsAction().catch(() => []),
    getContactInfoFromSupabase().catch(() => null),
    getPrivacyPolicyFromSupabase().catch(() => null),
    getLegalNoticesFromSupabase().catch(() => null),
  ]);

  const roles = getRoles();

  return (
    <AdminDashboardClient
      initialMembers={members}
      initialProjects={projects}
      initialRoles={roles}
      initialGeneralInfo={{
        contactInfo,
        privacyPolicy,
        legalNotices,
      }}
    />
  );
}
