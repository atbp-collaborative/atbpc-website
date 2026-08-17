'use client';

import React from 'react';
import { ContactFormPage } from '@/components/blocks/ContactFormPage';
import { MS_FORMS_CONFIG } from '@/lib/services/leads';

export default function DiscoverySessionPage() {
  return (
    <ContactFormPage
      title="schedule a discovery session"
      subtitle="for project intake, site feasibility & spatial planning consultations"
      formsUrl={MS_FORMS_CONFIG.discoverySessionFormUrl}
      embedTitle="Microsoft Forms Discovery Session"
    />
  );
}
