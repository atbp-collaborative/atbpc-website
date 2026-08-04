'use client';

import React from 'react';
import { PartnerApplicationForm } from '../../../components/PartnerApplicationForm';

export default function ConsultantPage() {
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

  const conditionsContent = (
    <>
      <p>
        1. <strong>Professional Licensing:</strong> Partner consultants and specialist firms must hold active PRC/PTR professional licenses or accredited corporate engineering practice permits.
      </p>
      <p>
        2. <strong>Design Integrity & Calculation Standards:</strong> All technical calculations, BIM models, and structural/MEPFS drawings must align with national codes and studio specifications.
      </p>
      <p>
        3. <strong>Confidentiality & Peer Review:</strong> Information disclosed through this portal is safeguarded for studio project matching, fee estimations, and inter-practice collaboration.
      </p>
    </>
  );

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
