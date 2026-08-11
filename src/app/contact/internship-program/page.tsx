'use client';

import React from 'react';
import { CareerForm } from '@/components/forms/CareerForm';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function Page() {
  useDocumentTitle('Internship Program');
  return <CareerForm initialStructure="Internship Fellowship" />;
}
