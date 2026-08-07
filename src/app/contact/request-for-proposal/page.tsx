'use client';

import React from 'react';
import { ContactFormPage } from '../../../components/ContactFormPage';
import { MS_FORMS_CONFIG } from '../../../lib/data/leads';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';

export default function RequestForProposalPage() {
  useDocumentTitle('Request a Proposal');
  return (
    <ContactFormPage
      title="request a proposal"
      subtitle="coordinate your build budget, location, and structural requirements"
      formsUrl={MS_FORMS_CONFIG.requestProposalFormUrl}
      embedTitle="Microsoft Forms Request a Proposal"
    />
  );
}
