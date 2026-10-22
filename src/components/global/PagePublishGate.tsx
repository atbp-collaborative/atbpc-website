'use client';

import React from 'react';
import { useIsSubpageDraft } from '@/context/SitePagesContext';
import { UnderMaintenanceView } from '@/components/global/UnderMaintenanceView';

interface PagePublishGateProps {
  slug: string;
  children: React.ReactNode;
}

export const PagePublishGate: React.FC<PagePublishGateProps> = ({ slug, children }) => {
  const isDraft = useIsSubpageDraft(slug);

  if (isDraft) {
    return <UnderMaintenanceView mode="page" isEmbedded={true} />;
  }

  return <>{children}</>;
};
