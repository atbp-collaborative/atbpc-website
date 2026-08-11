'use client';

import React from 'react';
import { PartnerApplicationForm } from '@/components/forms/PartnerApplicationForm';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { consultantConditionsData } from '@/lib/modals/partner-conditions';

export default function ConsultantPage() {
  useDocumentTitle('Consultants');
  const specialties = [
    'Structural Engineering Practice',
    'MEPFS Engineering (Mechanical, Electrical, Plumbing, Fire)',
    'Environmental & Sustainability Engineering',
    'Geotechnical & Soil Dynamics',
    'Acoustic, AV & Illumination Design',
    'Quantity Surveying & Cost Management',
    'Facade & Building Physics Consultancy',
    'Heritage & Urban Planning Consultancy',
  ];

  const typologies = [
    'High-End Residential & Villa Assemblies',
    'Commercial, Hospitality & Mixed-Use',
    'Institutional & Cultural Structures',
    'High-Rise & Industrial Facilities',
    'Master Planning & Landscape Infrastructure',
  ];

  const conditionsContent = consultantConditionsData;

  return (
    <PartnerApplicationForm
      variant="consultant"
      title="be our partner consultant"
      subtitle="we need to know if you share the same values, integrity and culture."
      specialties={specialties}
      typologies={typologies}
      successTitle="Consultant Registration Submitted"
      successMessage="Thank you for applying as a partner consultant with ATBP Collaborative. Our engineering and design leadership will review your credentials and contact you directly."
      submitAnotherLabel="Submit Another Application"
      conditionsTitle="General Conditions for Consultant Partnership"
      conditionsContent={conditionsContent}
    />
  );
}
