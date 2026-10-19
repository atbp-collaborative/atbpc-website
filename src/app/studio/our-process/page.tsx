'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingCard } from '@/components/blocks/LandingPage';
import { SubLandingPage } from '@/components/blocks/SubLandingPage';
import { DraftNotice } from '@/components/global/DraftNotice';
import { ROUTES } from '@/lib/navigation/routes';
import { OUR_PROCESS_CARDS } from '@/lib/dummy-data/our-process/process-data';
import { getSitePagesData } from '@/services/dummy-data.service';
import { SitePage } from '@/types';

export default function OurProcessPage() {
  const [pageInfo, setPageInfo] = React.useState<SitePage | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    getSitePagesData().then((pages) => {
      const p = pages.find((page) => page.id === 'process-hub');
      if (p) setPageInfo(p);
    });
  }, []);

  if (pageInfo && pageInfo.isDraft) {
    return (
      <DraftNotice
        pageTitle={pageInfo.title || 'Our Process'}
        subtitle={pageInfo.subtitle}
      />
    );
  }

  const cards: LandingCard[] = OUR_PROCESS_CARDS.map(card => ({
    id: card.id,
    title: card.title,
    tagline: card.tagline,
    subtext: card.subtext,
    image: card.image,
    onSelect: () => router.push(card.href ?? ROUTES.services),
  }));

  const subtitle = pageInfo?.subtitle || 'Purpose-built responses for one-of-a-kind briefs';

  return (
    <SubLandingPage
      cards={cards}
      title="our process"
      subtitle={subtitle}
      isHeaderSticky={true}
    />
  );
}
