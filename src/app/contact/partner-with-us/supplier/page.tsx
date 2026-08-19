'use client';

import React from 'react';
import { PartnerApplicationForm } from '@/components/forms/PartnerApplicationForm';
import { supplierConditionsData } from '@/lib/modals/partner-conditions';

export default function SupplierPage() {
  const categories = [
    'Division 00 — Procurement and Contracting Requirements',
    'Division 01 — General Requirements',
    'Division 02 — Existing Conditions',
    'Division 03 — Concrete',
    'Division 04 — Masonry',
    'Division 05 — Metals',
    'Division 06 — Wood, Plastics, and Composites',
    'Division 07 — Thermal and Moisture Protection',
    'Division 08 — Openings',
    'Division 09 — Finishes',
    'Division 10 — Specialties',
    'Division 11 — Equipment',
    'Division 12 — Furnishings',
    'Division 13 — Special Construction',
    'Division 14 — Conveying Equipment',
    'Division 15 — Reserved',
    'Division 16 — Reserved',
    'Division 17 — Reserved',
    'Division 18 — Reserved',
    'Division 19 — Reserved',
    'Division 20 — Reserved',
    'Division 21 — Fire Suppression',
    'Division 22 — Plumbing',
    'Division 23 — Heating, Ventilating, and Air Conditioning (HVAC)',
    'Division 24 — Reserved',
    'Division 25 — Integrated Automation',
    'Division 26 — Electrical',
    'Division 27 — Communications',
    'Division 28 — Electronic Safety and Security',
    'Division 29 — Reserved',
    'Division 30 — Reserved',
    'Division 31 — Earthwork',
    'Division 32 — Exterior Improvements',
    'Division 33 — Utilities',
    'Division 34 — Transportation',
    'Division 35 — Waterway and Marine Construction',
    'Division 36 — Reserved',
    'Division 37 — Reserved',
    'Division 38 — Reserved',
    'Division 39 — Reserved',
    'Division 40 — Process Integration',
    'Division 41 — Material Processing and Handling Equipment',
    'Division 42 — Process Heating, Cooling, and Drying Equipment',
    'Division 43 — Process Gas and Liquid Handling, Purification and Storage Equipment',
    'Division 44 — Pollution Control Equipment',
    'Division 45 — Industry-Specific Manufacturing Equipment',
    'Division 46 — Water and Wastewater Equipment',
    'Division 47 — Reserved',
    'Division 48 — Electrical Power Generation',
    'Division 49 — Reserved',
  ];

  const conditionsContent = supplierConditionsData;

  return (
    <PartnerApplicationForm
      variant="supplier"
      title="supply us with quality specifications"
      subtitle="we qualify all products before specifying them on projects entrusted to us by our clients"
      categories={categories}
      successTitle="Specification Request Received"
      successMessage="Thank you for submitting your product specifications. Our technical procurement team will evaluate your material catalog for upcoming ATBP Collaborative projects."
      submitAnotherLabel="Submit Another Specification"
      conditionsTitle="General Conditions for Product Qualification"
      conditionsContent={conditionsContent}
    />
  );
}
