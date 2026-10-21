/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  getContactInfoFromSupabase,
  getPrivacyPolicyFromSupabase,
  getCareerPrivacyFromSupabase,
  getPartnerConditionsFromSupabase,
  getLegalNoticesFromSupabase,
} from '@/services/supabase/settings.service';
import { AdminGeneralInfoClient } from './AdminGeneralInfoClient';

export const revalidate = 60;

export default async function AdminGeneralInfoPage() {
  const [contactInfo, privacyPolicy, careerPrivacy, partnerConditions, legalNotices] = await Promise.all([
    getContactInfoFromSupabase().catch(() => null),
    getPrivacyPolicyFromSupabase().catch(() => null),
    getCareerPrivacyFromSupabase().catch(() => null),
    getPartnerConditionsFromSupabase().catch(() => null),
    getLegalNoticesFromSupabase().catch(() => null),
  ]);

  return (
    <AdminGeneralInfoClient
      initialData={{
        contactInfo,
        privacyPolicy,
        careerPrivacy,
        partnerConditions,
        legalNotices,
      }}
    />
  );
}
