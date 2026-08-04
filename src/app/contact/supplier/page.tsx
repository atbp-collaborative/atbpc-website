'use client';

import React from 'react';
import { PartnerApplicationForm } from '../../../components/PartnerApplicationForm';

export default function SupplierPage() {
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

  const conditionsContent = (
    <>
      <p>
        1. <strong>Quality Verification:</strong> All submitted material specifications, MSDS documents, and physical catalogs are pre-screened according to strict structural, aesthetic, and environmental sustainability standards prior to studio specification.
      </p>
      <p>
        2. <strong>Warranty & Lead Times:</strong> Suppliers must provide verified lead times and manufacturer warranty coverage for custom millwork, finishes, and specialized hardware.
      </p>
      <p>
        3. <strong>Data Confidentiality:</strong> Product documentation provided through this portal will be archived exclusively for internal procurement, mock-up schedules, and client bill-of-quantity estimations.
      </p>
    </>
  );

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
