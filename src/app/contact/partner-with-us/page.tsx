'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingCard } from '@/components/blocks/LandingPage';
import { SubLandingPage } from '@/components/blocks/SubLandingPage';
import { DraftNotice } from '@/components/global/DraftNotice';
import { ROUTES } from '@/lib/navigation/routes';
import { PARTNER_WITH_US_CARDS } from '@/lib/dummy-data/contact/contact-cards';
import { getSitePagesData } from '@/services/dummy-data.service';
import { SitePage } from '@/types';

export default function PartnerWithUsPage() {
  const [pageInfo, setPageInfo] = React.useState<SitePage | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    getSitePagesData().then((pages) => {
      const p = pages.find((page) => page.id === 'partner-with-us');
      if (p) setPageInfo(p);
    });
  }, []);

  if (pageInfo && pageInfo.isDraft) {
    return (
      <DraftNotice
        pageTitle={pageInfo.title || 'Partner With Us'}
        subtitle={pageInfo.subtitle}
      />
    );
  }

  const cards: LandingCard[] = PARTNER_WITH_US_CARDS.map((card) => ({
    id: card.id,
    title: card.title,
    tagline: card.tagline,
    subtext: card.subtext,
    tags: card.tags,
    image: card.image,
    onSelect: () => router.push(card.href ?? ROUTES.contact),
  }));

  const subtitle = pageInfo?.subtitle || 'collaborate with us as a supplier, builder, or consultant';

  return (
    <SubLandingPage
      cards={cards}
      title="partner with us"
      subtitle={subtitle}
      isHeaderSticky={true}
    />
  );
}
