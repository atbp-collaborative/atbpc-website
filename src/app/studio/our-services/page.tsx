import React from 'react';
import { getNavigationCardsData, getSitePagesData } from '@/services/dummy-data.service';
import { DraftNotice } from '@/components/global/DraftNotice';
import { OurServicesClient } from './OurServicesClient';

export const revalidate = 60;

export default async function OurServicesPage() {
  const [navCards, pages] = await Promise.all([
    getNavigationCardsData('services'),
    getSitePagesData(),
  ]);

  const pageInfo = pages.find((page) => page.id === 'services-hub') || null;

  if (pageInfo && pageInfo.isDraft) {
    return (
      <DraftNotice
        pageTitle={pageInfo.title || 'Our Services'}
        subtitle={pageInfo.subtitle}
      />
    );
  }

  return <OurServicesClient navCards={navCards} pageInfo={pageInfo} />;
}
