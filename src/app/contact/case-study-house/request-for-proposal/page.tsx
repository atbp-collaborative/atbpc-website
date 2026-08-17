'use client';

import React from 'react';
import { ContactFormPage } from '@/components/blocks/ContactFormPage';
import { MS_FORMS_CONFIG } from '@/lib/services/leads';

export default function RequestForProposalPage() {
  return (
    <ContactFormPage
      title="request a proposal"
      subtitle="coordinate your build budget, location, and structural requirements"
      formsUrl={MS_FORMS_CONFIG.requestProposalFormUrl}
      embedTitle="Microsoft Forms Request a Proposal"
    />
  );
}
