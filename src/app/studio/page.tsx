import React from 'react';
import { getNavigationCardsData, getSitePagesData } from '@/services/dummy-data.service';
import { DraftNotice } from '@/components/global/DraftNotice';
import { StudioClient } from './StudioClient';

export const revalidate = 60;

export default async function StudioPage() {
  const [navCards, pages] = await Promise.all([
    getNavigationCardsData('studio'),
    getSitePagesData(),
  ]);

  const pageInfo = pages.find((page) => page.id === 'studio-hub') || null;

  if (pageInfo && pageInfo.isDraft) {
    return (
      <DraftNotice
        pageTitle={pageInfo.title || 'Studio'}
        subtitle={pageInfo.subtitle}
      />
    );
  }

  return <StudioClient navCards={navCards} />;
}
