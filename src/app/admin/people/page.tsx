/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { fetchAdminPeopleAction } from '@/app/actions/admin-mutations';
import { getLicensesFromSupabase } from '@/services/supabase/licenses.service';
import { AdminPeopleClient } from './AdminPeopleClient';

export const revalidate = 60;

export default async function AdminPeoplePage() {
  const [members, licenses] = await Promise.all([
    fetchAdminPeopleAction().catch(() => []),
    getLicensesFromSupabase().catch(() => []),
  ]);

  return <AdminPeopleClient initialMembers={members} initialLicenses={licenses} />;
}
