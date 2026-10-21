import React from 'react';
import { getNavigationCardsData, getSitePagesData } from '@/services/dummy-data.service';
import { DraftNotice } from '@/components/global/DraftNotice';
import { ContactClient } from './ContactClient';

export const revalidate = 60;

export default async function ContactPage() {
  const [navCards, pages] = await Promise.all([
    getNavigationCardsData('contact'),
    getSitePagesData(),
  ]);

  const pageInfo = pages.find((page) => page.id === 'contact-hub') || null;

  if (pageInfo && pageInfo.isDraft) {
    return (
      <DraftNotice
        pageTitle={pageInfo.title || 'Contact'}
        subtitle={pageInfo.subtitle}
      />
    );
  }

  return <ContactClient navCards={navCards} />;
}
