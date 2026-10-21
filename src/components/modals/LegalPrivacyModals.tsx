'use client';

import React, { useState, useEffect } from 'react';
import { InfoModal } from '@/components/modals/InfoModal';
import { legalModalData } from '@/lib/modals/legal';
import { privacyPolicyModalData } from '@/lib/modals/privacy-policy';
import { ModalData } from '@/lib/modals/types';
import { getSiteSettingsBatchFromSupabase } from '@/services/supabase/settings.service';

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
    getSiteSettingsBatchFromSupabase(['legal_notices', 'privacy_policy'])
      .then((batch) => {
        if (!isMounted) return;
        const fetchedLegal = batch['legal_notices'] as ModalData | undefined;
        const fetchedPrivacy = batch['privacy_policy'] as ModalData | undefined;

        if (fetchedLegal && (fetchedLegal.bodyHtml || fetchedLegal.sections?.length || fetchedLegal.intro)) {
          setLegalData(fetchedLegal);
        }
        if (fetchedPrivacy && (fetchedPrivacy.bodyHtml || fetchedPrivacy.sections?.length || fetchedPrivacy.intro)) {
          setPrivacyData(fetchedPrivacy);
        }
      })
      .catch(() => {});

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
