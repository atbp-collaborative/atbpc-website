'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingCard } from '@/components/blocks/LandingPage';
import { SubLandingPage } from '@/components/blocks/SubLandingPage';
import { NavigationCardItem, SitePage } from '@/types';

interface OurProcessClientProps {
  navCards: NavigationCardItem[];
  pageInfo?: SitePage | null;
}

export function OurProcessClient({ navCards, pageInfo }: OurProcessClientProps) {
  const router = useRouter();

  const cards: LandingCard[] = navCards.map((card, idx) => ({
    id: card.id,
    title: card.title,
    tagline: card.tagline,
    subtext: card.subtext,
    footerText: card.footerText,
    tags: card.tags,
    image: card.imageUrl,
    priority: idx < 3,
    onSelect: () => {
      if (card.targetHref) {
        router.push(card.targetHref);
      } else if (card.cardKey === 'designing-with-values' || card.title.toLowerCase().includes('designing')) {
        router.push('/studio/our-process/designing-with-values');
      } else if (card.cardKey === 'managing-with-integrity' || card.title.toLowerCase().includes('managing')) {
        router.push('/studio/our-process/managing-with-integrity');
      } else {
        router.push('/studio/our-process/building-with-culture');
      }
    },
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
