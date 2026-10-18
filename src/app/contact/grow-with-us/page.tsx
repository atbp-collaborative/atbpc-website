'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingCard } from '@/components/blocks/LandingPage';
import { SubLandingPage } from '@/components/blocks/SubLandingPage';
import { DraftNotice } from '@/components/global/DraftNotice';
import { ROUTES } from '@/lib/navigation/routes';
import { GROW_WITH_US_CARDS } from '@/lib/dummy-data/contact/contact-cards';
import { getSitePagesData } from '@/services/dummy-data.service';
import { SitePage } from '@/types';

export default function GrowWithUsPage() {
  const [pageInfo, setPageInfo] = React.useState<SitePage | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    getSitePagesData().then((pages) => {
      const p = pages.find((page) => page.id === 'grow-with-us');
      if (p) setPageInfo(p);
    });
  }, []);

  if (pageInfo && pageInfo.isDraft) {
    return (
      <DraftNotice
        pageTitle={pageInfo.title || 'Grow With Us'}
        subtitle={pageInfo.subtitle}
      />
    );
  }

  const cards: LandingCard[] = GROW_WITH_US_CARDS.map(card => ({
    id: card.id,
    title: card.title,
    tagline: card.tagline,
    subtext: card.subtext,
    tags: card.tags,
    image: card.image,
    onSelect: () => router.push(card.href ?? ROUTES.contact),
  }));

  const subtitle = pageInfo?.subtitle || 'career and mentorship opportunities at ATBP Collaborative';

  return (
    <SubLandingPage
      cards={cards}
      title="grow with us"
      subtitle={subtitle}
      isHeaderSticky={true}
    />
  );
}
