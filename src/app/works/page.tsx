import React from 'react';
import { getSitePagesData } from '@/services/dummy-data.service';
import { DraftNotice } from '@/components/global/DraftNotice';
import { WorksClient } from './WorksClient';

export const revalidate = 60;

export default async function WorksPage() {
  const pages = await getSitePagesData();
  const pageInfo = pages.find((page) => page.id === 'works');

  if (pageInfo && pageInfo.isDraft) {
    return (
      <DraftNotice
        pageTitle={pageInfo.title || 'Works'}
        subtitle={pageInfo.subtitle}
      />
    );
  }

  return <WorksClient />;
}
