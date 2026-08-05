'use client';

import React from 'react';
import { ContactFormPage } from '../../../components/ContactFormPage';
import { MS_FORMS_CONFIG } from '../../../lib/data/leads';

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
