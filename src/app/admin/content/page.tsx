/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  fetchAdminSitePages,
  fetchAdminNavigationCards,
  fetchAdminProcessPhilosophies,
  fetchAdminServiceOfferings,
  fetchAdminHomeSlides,
  fetchAdminHomepageSlogans,
  fetchAdminStageGroups,
} from '@/services/supabase/cms-admin.service';
import { AdminContentClient } from './AdminContentClient';

export const revalidate = 60;

export default async function AdminContentPage() {
  const [pages, cards, philosophies, services, slides, slogans, stageGroups] = await Promise.all([
    fetchAdminSitePages().catch(() => []),
    fetchAdminNavigationCards().catch(() => []),
    fetchAdminProcessPhilosophies().catch(() => []),
    fetchAdminServiceOfferings().catch(() => []),
    fetchAdminHomeSlides().catch(() => []),
    fetchAdminHomepageSlogans().catch(() => ({ slogans: [], heroSubtext: [] })),
    fetchAdminStageGroups('designing-with-values').catch(() => []),
  ]);

  return (
    <AdminContentClient
      initialData={{
        pages,
        cards,
        philosophies,
        services,
        slides,
        slogans,
        stageGroups,
      }}
    />
  );
}
