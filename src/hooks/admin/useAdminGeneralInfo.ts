/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { ContactInfo } from '@/lib/dummy-data/contact/contact-info';
import { ModalData } from '@/lib/modals/types';
import { StudioWriteups } from '@/types';
import {
  getContactInfo,
  saveContactInfo as saveContactInfoStorage,
  getPrivacyPolicy,
  savePrivacyPolicy as savePrivacyPolicyStorage,
  getLegalNotices,
  saveLegalNotices as saveLegalNoticesStorage,
  getStudioWriteups,
  saveStudioWriteups as saveStudioWriteupsStorage,
  resetAdminStorageToDefaults,
} from '@/services/mock/adminMockStorage';
import { toast } from 'sonner';

export function useAdminGeneralInfo() {
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [privacyPolicy, setPrivacyPolicy] = useState<ModalData | null>(null);
  const [legalNotices, setLegalNotices] = useState<ModalData | null>(null);
  const [studioWriteups, setStudioWriteups] = useState<StudioWriteups | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setContactInfo(getContactInfo());
    setPrivacyPolicy(getPrivacyPolicy());
    setLegalNotices(getLegalNotices());
    setStudioWriteups(getStudioWriteups());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveContact = useCallback((data: ContactInfo) => {
    const saved = saveContactInfoStorage(data);
    setContactInfo(saved);
    toast.success('Contact info updated successfully');
  }, []);

  const savePrivacy = useCallback((data: ModalData) => {
    const saved = savePrivacyPolicyStorage(data);
    setPrivacyPolicy(saved);
    toast.success('Privacy policy updated successfully');
  }, []);

  const saveLegal = useCallback((data: ModalData) => {
    const saved = saveLegalNoticesStorage(data);
    setLegalNotices(saved);
    toast.success('Legal notices updated successfully');
  }, []);

  const saveWriteups = useCallback((data: StudioWriteups) => {
    const saved = saveStudioWriteupsStorage(data);
    setStudioWriteups(saved);
    toast.success('Studio writeups updated successfully');
  }, []);

  const resetDefaults = useCallback(() => {
    resetAdminStorageToDefaults();
    refresh();
    toast.info('All content reset to system defaults');
  }, [refresh]);

  return {
    contactInfo,
    privacyPolicy,
    legalNotices,
    studioWriteups,
    isLoading,
    refresh,
    saveContact,
    savePrivacy,
    saveLegal,
    saveWriteups,
    resetDefaults,
  };
}
