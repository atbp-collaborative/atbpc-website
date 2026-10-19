'use client';

import React from 'react';
import { CareerForm } from '@/components/forms/CareerForm';
import { PagePublishGate } from '@/components/global/PagePublishGate';

export default function ApprenticeshipProgramsPage() {
  return (
    <PagePublishGate slug="contact/grow-with-us/apprenticeship-programs">
      <CareerForm initialStructure="" formType="apprenticeship" />
    </PagePublishGate>
  );
}
