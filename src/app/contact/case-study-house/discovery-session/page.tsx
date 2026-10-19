'use client';

import React from 'react';
import { DiscoverySessionForm } from '@/components/forms/DiscoverySessionForm';
import { PagePublishGate } from '@/components/global/PagePublishGate';

export default function DiscoverySessionPage() {
  return (
    <PagePublishGate slug="contact/case-study-house/discovery-session">
      <DiscoverySessionForm />
    </PagePublishGate>
  );
}
