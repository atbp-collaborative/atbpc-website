import React from 'react';
import { getNavigationCardsData, getSitePagesData } from '@/services/dummy-data.service';
import { DraftNotice } from '@/components/global/DraftNotice';
import { PartnerWithUsClient } from './PartnerWithUsClient';

export const revalidate = 60;

export default async function PartnerWithUsPage() {
  const [navCards, pages] = await Promise.all([
    getNavigationCardsData('partner-with-us'),
    getSitePagesData(),
  ]);

  const pageInfo = pages.find((page) => page.id === 'partner-with-us') || null;

  if (pageInfo && pageInfo.isDraft) {
    return (
      <DraftNotice
        pageTitle={pageInfo.title || 'Partner With Us'}
        subtitle={pageInfo.subtitle}
      />
    );
  }

  return <PartnerWithUsClient navCards={navCards} pageInfo={pageInfo} />;
}
