'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingCard } from '@/components/blocks/LandingPage';
import { SubLandingPage } from '@/components/blocks/SubLandingPage';
import { ROUTES } from '@/lib/navigation/routes';
import { OUR_PROCESS_CARDS } from '@/lib/dummy-data/our-process/process-data';
import { SitePage } from '@/types';

interface OurProcessClientProps {
  pageInfo?: SitePage | null;
}

export function OurProcessClient({ pageInfo }: OurProcessClientProps) {
  const router = useRouter();

  const cards: LandingCard[] = OUR_PROCESS_CARDS.map((card, idx) => ({
    id: card.id,
    title: card.title,
    tagline: card.tagline,
    subtext: card.subtext,
    image: card.image,
    priority: idx < 3,
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
