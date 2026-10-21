import React from 'react';
import { getSitePagesData } from '@/services/dummy-data.service';
import { DraftNotice } from '@/components/global/DraftNotice';
import { CaseStudyHouseClient } from './CaseStudyHouseClient';

export const revalidate = 60;

export default async function CaseStudyHousePage() {
  const pages = await getSitePagesData();
  const pageInfo = pages.find((page) => page.id === 'case-study-house') || null;

  if (pageInfo && pageInfo.isDraft) {
    return (
      <DraftNotice
        pageTitle={pageInfo.title || 'The Case Study House'}
        subtitle={pageInfo.subtitle}
      />
    );
  }

  return <CaseStudyHouseClient pageInfo={pageInfo} />;
}
