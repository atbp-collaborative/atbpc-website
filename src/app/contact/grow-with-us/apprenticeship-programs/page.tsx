'use client';

import React from 'react';
import { CareerForm } from '@/components/forms/CareerForm';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function Page() {
  useDocumentTitle('Apprenticeship Programs');
  return <CareerForm initialStructure="Apprenticeship / Junior Architect" />;
}
