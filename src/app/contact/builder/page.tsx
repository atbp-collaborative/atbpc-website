'use client';

import React from 'react';
import { PartnerApplicationForm } from '../../../components/PartnerApplicationForm';

export default function BuilderPage() {
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

  const conditionsContent = (
    <>
      <p>
        1. <strong>Licensing & Integrity:</strong> Partner builders must hold valid PCAB licenses and tax registrations (BIR / SEC / DTI) matching their declared scope of work and construction category.
      </p>
      <p>
        2. <strong>Workmanship Standards:</strong> All construction methods, site safety protocols, and material assemblies must adhere strictly to ATBP Collaborative architectural blueprints and specifications.
      </p>
      <p>
        3. <strong>Contractual Transparency:</strong> Sample contracts and project execution methodologies are verified for cost-transparency, delay penalties, and warranty guarantees.
      </p>
    </>
  );

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
