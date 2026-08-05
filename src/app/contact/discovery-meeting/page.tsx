'use client';

import React from 'react';
import { ContactFormPage } from '../../../components/ContactFormPage';
import { MS_FORMS_CONFIG } from '../../../lib/data/leads';

export default function DiscoveryMeetingPage() {
  return (
    <ContactFormPage
      title="schedule a discovery meeting"
      subtitle="for project intake, site feasibility & spatial planning consultations"
      formsUrl={MS_FORMS_CONFIG.discoveryMeetingFormUrl}
      embedTitle="Microsoft Forms Discovery Meeting"
    />
  );
}
