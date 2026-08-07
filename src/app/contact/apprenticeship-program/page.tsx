'use client';

import React from 'react';
import { CareerForm } from '../../../components/CareerForm';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';

export default function Page() {
  useDocumentTitle('Apprenticeship Program');
  return <CareerForm initialStructure="Apprenticeship / Junior Architect" />;
}
