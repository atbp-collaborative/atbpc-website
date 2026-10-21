/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { getSiteSettingsBatchFromSupabase } from '@/services/supabase/settings.service';
import { AdminGeneralInfoClient } from './AdminGeneralInfoClient';
import { ContactInfo } from '@/lib/dummy-data/contact/contact-info';
import { ModalData } from '@/lib/modals/types';
import { CareerPrivacyData, PartnerConditionsData } from '@/types';

export const revalidate = 60;

export default async function AdminGeneralInfoPage() {
  const batch = await getSiteSettingsBatchFromSupabase([
    'contact_info',
    'privacy_policy',
    'career_privacy',
    'partner_conditions',
    'legal_notices',
  ]);

  return (
    <AdminGeneralInfoClient
      initialData={{
        contactInfo: (batch['contact_info'] as ContactInfo) || null,
        privacyPolicy: (batch['privacy_policy'] as ModalData) || null,
        careerPrivacy: (batch['career_privacy'] as CareerPrivacyData) || null,
        partnerConditions: (batch['partner_conditions'] as PartnerConditionsData) || null,
        legalNotices: (batch['legal_notices'] as ModalData) || null,
      }}
    />
  );
}
