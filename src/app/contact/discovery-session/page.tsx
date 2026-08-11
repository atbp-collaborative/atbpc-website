'use client';

import React from 'react';
import { ContactFormPage } from '@/components/blocks/ContactFormPage';
import { MS_FORMS_CONFIG } from '@/lib/services/leads';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function DiscoverySessionPage() {
  useDocumentTitle('Schedule a Discovery Session');
  return (
    <ContactFormPage
      title="schedule a discovery session"
      subtitle="for project intake, site feasibility & spatial planning consultations"
      formsUrl={MS_FORMS_CONFIG.discoverySessionFormUrl}
      embedTitle="Microsoft Forms Discovery Session"
    />
  );
}
