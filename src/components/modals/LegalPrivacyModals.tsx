'use client';

import React, { useState, useEffect } from 'react';
import { InfoModal } from '@/components/modals/InfoModal';
import { legalModalData } from '@/lib/modals/legal';
import { privacyPolicyModalData } from '@/lib/modals/privacy-policy';
import { ModalData } from '@/lib/modals/types';
import {
  getLegalNoticesFromSupabase,
  getPrivacyPolicyFromSupabase,
} from '@/services/supabase/settings.service';

export interface LegalPrivacyModalsProps {
  isDarkMode: boolean;
  isLegalOpen: boolean;
  onLegalClose: () => void;
  isPrivacyOpen: boolean;
  onPrivacyClose: () => void;
}

export const LegalPrivacyModals: React.FC<LegalPrivacyModalsProps> = ({
  isDarkMode,
  isLegalOpen,
  onLegalClose,
  isPrivacyOpen,
  onPrivacyClose,
}) => {
  const [legalData, setLegalData] = useState<ModalData>(legalModalData.contents);
  const [privacyData, setPrivacyData] = useState<ModalData>(privacyPolicyModalData.contents);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getLegalNoticesFromSupabase().catch(() => null),
      getPrivacyPolicyFromSupabase().catch(() => null),
    ]).then(([fetchedLegal, fetchedPrivacy]) => {
      if (!isMounted) return;
      if (fetchedLegal && (fetchedLegal.sections?.length || fetchedLegal.intro)) {
        setLegalData(fetchedLegal);
      }
      if (fetchedPrivacy && (fetchedPrivacy.sections?.length || fetchedPrivacy.intro)) {
        setPrivacyData(fetchedPrivacy);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <InfoModal
        isOpen={isLegalOpen}
        onClose={onLegalClose}
        isDarkMode={isDarkMode}
        data={legalData}
      />

      <InfoModal
        isOpen={isPrivacyOpen}
        onClose={onPrivacyClose}
        isDarkMode={isDarkMode}
        data={privacyData}
      />
    </>
  );
};
