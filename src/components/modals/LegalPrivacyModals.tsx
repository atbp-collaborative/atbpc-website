'use client';

import React from 'react';
import { InfoModal } from '@/components/modals/InfoModal';
import { legalModalData } from '@/lib/modals/legal';
import { privacyPolicyModalData } from '@/lib/modals/privacy-policy';

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
  return (
    <>
      <InfoModal
        isOpen={isLegalOpen}
        onClose={onLegalClose}
        isDarkMode={isDarkMode}
        data={legalModalData.contents}
      />

      <InfoModal
        isOpen={isPrivacyOpen}
        onClose={onPrivacyClose}
        isDarkMode={isDarkMode}
        data={privacyPolicyModalData.contents}
      />
    </>
  );
};
