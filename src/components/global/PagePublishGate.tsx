'use client';

import React from 'react';
import { useIsSubpageDraft } from '@/context/SitePagesContext';
import { UnderConstructionView } from '@/components/global/UnderConstructionView';

interface PagePublishGateProps {
  slug: string;
  children: React.ReactNode;
}

export const PagePublishGate: React.FC<PagePublishGateProps> = ({ slug, children }) => {
  const isDraft = useIsSubpageDraft(slug);

  if (isDraft) {
    return <UnderConstructionView isEmbedded={true} />;
  }

  return <>{children}</>;
};
