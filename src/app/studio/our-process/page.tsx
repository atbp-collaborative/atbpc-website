import React from 'react';
import { getNavigationCardsData, getSitePagesData } from '@/services/dummy-data.service';
import { DraftNotice } from '@/components/global/DraftNotice';
import { OurProcessClient } from './OurProcessClient';

export const revalidate = 60;

export default async function OurProcessPage() {
  const [navCards, pages] = await Promise.all([
    getNavigationCardsData('process'),
    getSitePagesData(),
  ]);

  const pageInfo = pages.find((page) => page.id === 'process-hub') || null;

  if (pageInfo && pageInfo.isDraft) {
    return (
      <DraftNotice
        pageTitle={pageInfo.title || 'Our Process'}
        subtitle={pageInfo.subtitle}
      />
    );
  }

  return <OurProcessClient navCards={navCards} pageInfo={pageInfo} />;
}
