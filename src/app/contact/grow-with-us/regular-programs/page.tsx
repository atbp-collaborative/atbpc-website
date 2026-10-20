'use client';

import React from 'react';
import { CareerForm } from '@/components/forms/CareerForm';
import { PagePublishGate } from '@/components/global/PagePublishGate';

export default function RegularProgramsPage() {
  return (
    <PagePublishGate slug="contact/grow-with-us/regular-programs">
      <CareerForm initialStructure="" formType="studioRegulars" />
    </PagePublishGate>
  );
}
