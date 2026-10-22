import React from 'react';
import { getNavigationCardsData, getSitePagesData } from '@/services/dummy-data.service';
import { DraftNotice } from '@/components/global/DraftNotice';
import { GrowWithUsClient } from './GrowWithUsClient';

export const revalidate = 60;

export default async function GrowWithUsPage() {
  const [navCards, pages] = await Promise.all([
    getNavigationCardsData('grow-with-us'),
    getSitePagesData(),
  ]);

  const pageInfo = pages.find((page) => page.id === 'grow-with-us') || null;

  if (pageInfo && pageInfo.isDraft) {
    return (
      <DraftNotice
        pageTitle={pageInfo.title || 'Grow With Us'}
        subtitle={pageInfo.subtitle}
      />
    );
  }

  return <GrowWithUsClient navCards={navCards} pageInfo={pageInfo} />;
}
