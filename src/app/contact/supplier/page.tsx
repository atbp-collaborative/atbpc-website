'use client';

import React from 'react';
import { PartnerApplicationForm } from '@/components/forms/PartnerApplicationForm';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { supplierConditionsData } from '@/lib/modals/partner-conditions';

export default function SupplierPage() {
  useDocumentTitle('Suppliers');
  const categories = [
    'Architectural Hardware & Metals',
    'Millwork, Timber & Joinery',
    'Stone, Ceramics & Tile Assemblies',
    'Lighting & Electrical Controls',
    'Glass, Glazing & Facade Systems',
    'Sanitaryware & Plumbing Fixtures',
    'F&B Equipment & Commercial Kitchen',
    'Finishes, Paints & Wall Coverings',
    'Acoustic Panels & Insulations',
    'Landscaping & Outdoor Materials',
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
