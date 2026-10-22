/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { ContactInfo } from '@/lib/dummy-data/contact/contact-info';
import { ModalData } from '@/lib/modals/types';
import { CareerPrivacyData, PartnerConditionsData } from '@/types';
import {
  getContactInfo,
  saveContactInfo as saveContactInfoStorage,
  getPrivacyPolicy,
  savePrivacyPolicy as savePrivacyPolicyStorage,
  getCareerPrivacy,
  saveCareerPrivacy as saveCareerPrivacyStorage,
  getPartnerConditions,
  savePartnerConditions as savePartnerConditionsStorage,
  getLegalNotices,
  saveLegalNotices as saveLegalNoticesStorage,
  resetAdminStorageToDefaults,
} from '@/services/mock/adminMockStorage';
import {
  getSiteSettingsBatchFromSupabase,
  saveSiteSettingToSupabase,
} from '@/services/supabase/settings.service';
import { toast } from 'sonner';

export interface AdminGeneralInfoInitialData {
  contactInfo?: ContactInfo | null;
  privacyPolicy?: ModalData | null;
  careerPrivacy?: CareerPrivacyData | null;
  partnerConditions?: PartnerConditionsData | null;
  legalNotices?: ModalData | null;
}

export function useAdminGeneralInfo(initialData?: AdminGeneralInfoInitialData) {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(initialData?.contactInfo || null);
  const [privacyPolicy, setPrivacyPolicy] = useState<ModalData | null>(initialData?.privacyPolicy || null);
  const [careerPrivacy, setCareerPrivacy] = useState<CareerPrivacyData | null>(initialData?.careerPrivacy || null);
  const [partnerConditions, setPartnerConditions] = useState<PartnerConditionsData | null>(initialData?.partnerConditions || null);
  const [legalNotices, setLegalNotices] = useState<ModalData | null>(initialData?.legalNotices || null);
  const [isLoading, setIsLoading] = useState(!initialData || !initialData.contactInfo);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      // High-performance single batch query to Supabase
      const batch = await getSiteSettingsBatchFromSupabase([
        'contact_info',
        'privacy_policy',
        'career_privacy',
        'partner_conditions',
        'legal_notices',
      ]);

      const sbContact = batch['contact_info'] as ContactInfo | undefined;
      const sbPrivacy = batch['privacy_policy'] as ModalData | undefined;
      const sbCareer = batch['career_privacy'] as CareerPrivacyData | undefined;
      const sbPartner = batch['partner_conditions'] as PartnerConditionsData | undefined;
      const sbLegal = batch['legal_notices'] as ModalData | undefined;

      setContactInfo(sbContact || getContactInfo());
      setPrivacyPolicy(sbPrivacy || getPrivacyPolicy());
      setCareerPrivacy(sbCareer || getCareerPrivacy());
      setPartnerConditions(sbPartner || getPartnerConditions());
      setLegalNotices(sbLegal || getLegalNotices());
    } catch {
      setContactInfo(getContactInfo());
      setPrivacyPolicy(getPrivacyPolicy());
      setCareerPrivacy(getCareerPrivacy());
      setPartnerConditions(getPartnerConditions());
      setLegalNotices(getLegalNotices());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialData || !initialData.contactInfo) {
      refresh();
    }
  }, [refresh, initialData]);

  const saveContact = useCallback(async (data: ContactInfo) => {
    // Automatically synchronize addressLines to match address string
    const synchronizedData: ContactInfo = {
      ...data,
      addressLines: data.address
        ? data.address.split('\n').map((l) => l.trim()).filter(Boolean)
        : [],
    };

    setContactInfo(synchronizedData);
    saveContactInfoStorage(synchronizedData);
    try {
      await saveSiteSettingToSupabase('contact_info', synchronizedData);
      toast.success('Contact info updated successfully');
    } catch (err: any) {
      console.warn('Supabase save contact failed, fallback to local:', err);
      toast.success('Contact info updated (saved locally)');
    }
  }, []);

  const savePrivacy = useCallback(async (data: ModalData) => {
    setPrivacyPolicy(data);
    savePrivacyPolicyStorage(data);
    try {
      await saveSiteSettingToSupabase('privacy_policy', data);
      toast.success('Privacy policy updated successfully');
    } catch (err: any) {
      console.warn('Supabase save privacy failed, fallback to local:', err);
      toast.success('Privacy policy updated (saved locally)');
    }
  }, []);

  const saveCareerPrivacy = useCallback(async (data: CareerPrivacyData) => {
    setCareerPrivacy(data);
    saveCareerPrivacyStorage(data);
    try {
      await saveSiteSettingToSupabase('career_privacy', data);
      toast.success('Grow-With-Us privacy statement updated successfully');
    } catch (err: any) {
      console.warn('Supabase save career privacy failed, fallback to local:', err);
      toast.success('Grow-With-Us privacy statement updated (saved locally)');
    }
  }, []);

  const savePartnerConditions = useCallback(async (data: PartnerConditionsData) => {
    setPartnerConditions(data);
    savePartnerConditionsStorage(data);
    try {
      await saveSiteSettingToSupabase('partner_conditions', data);
      toast.success('Partner General Conditions updated successfully');
    } catch (err: any) {
      console.warn('Supabase save partner conditions failed, fallback to local:', err);
      toast.success('Partner General Conditions updated (saved locally)');
    }
  }, []);

  const saveLegal = useCallback(async (data: ModalData) => {
    setLegalNotices(data);
    saveLegalNoticesStorage(data);
    try {
      await saveSiteSettingToSupabase('legal_notices', data);
      toast.success('Legal notices updated successfully');
    } catch (err: any) {
      console.warn('Supabase save legal failed, fallback to local:', err);
      toast.success('Legal notices updated (saved locally)');
    }
  }, []);

  const resetDefaults = useCallback(() => {
    resetAdminStorageToDefaults();
    refresh();
    toast.info('All content reset to system defaults');
  }, [refresh]);

  return {
    contactInfo,
    privacyPolicy,
    careerPrivacy,
    partnerConditions,
    legalNotices,
    isLoading,
    refresh,
    saveContact,
    savePrivacy,
    saveCareerPrivacy,
    savePartnerConditions,
    saveLegal,
    resetDefaults,
  };
}
