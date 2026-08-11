'use client';

import React from 'react';
import { PartnerApplicationForm } from '@/components/forms/PartnerApplicationForm';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { builderConditionsData } from '@/lib/modals/partner-conditions';

export default function BuilderPage() {
  useDocumentTitle('Builders');
  const specialties = [
    'General Building Contractor',
    'Architectural Fit-Out & Joinery',
    'Structural Steel & Concrete Framing',
    'MEPFS (Mechanical, Electrical, Plumbing, Sanitary, Fire Protection)',
    'Specialized Modular & Pod Construction',
    'Facade, Enclosure & Curtain Wall Assemblies',
    'Civil Works & Site Infrastructure',
  ];

  const typologies = [
    'High-End Residential & Case Study Houses',
    'Commercial & F&B Retail Spaces',
    'Hospitality & Resort Developments',
    'Institutional & Cultural Buildings',
    'Industrial & High-Density Logistics',
    'Heritage Preservation & Adaptive Reuse',
  ];

  const conditionsContent = builderConditionsData;

  return (
    <PartnerApplicationForm
      variant="builder"
      title="be our partner builder"
      subtitle="we need to know if you share the same values, integrity and culture."
      specialties={specialties}
      typologies={typologies}
      successTitle="Builder Registration Submitted"
      successMessage="Thank you for applying as a partner builder with ATBP Collaborative. Our project directorate will review your PCAB credentials, sample contract, and site capabilities."
      submitAnotherLabel="Submit Another Application"
      conditionsTitle="General Conditions for Builder Partnership"
      conditionsContent={conditionsContent}
    />
  );
}
