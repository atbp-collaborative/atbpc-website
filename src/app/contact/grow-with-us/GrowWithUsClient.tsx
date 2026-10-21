'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingCard } from '@/components/blocks/LandingPage';
import { SubLandingPage } from '@/components/blocks/SubLandingPage';
import { ROUTES } from '@/lib/navigation/routes';
import { NavigationCardItem, SitePage } from '@/types';

interface GrowWithUsClientProps {
  navCards: NavigationCardItem[];
  pageInfo?: SitePage | null;
}

export function GrowWithUsClient({ navCards, pageInfo }: GrowWithUsClientProps) {
  const router = useRouter();

  const cards: LandingCard[] = navCards.map((card, idx) => ({
    id: card.id,
    title: card.title,
    tagline: card.tagline,
    subtext: card.subtext,
    tags: card.tags,
    image: card.imageUrl,
    priority: idx < 3,
    onSelect: () => {
      if (card.targetHref) {
        router.push(card.targetHref);
      } else if (card.cardKey === 'apprenticeship' || card.title.toLowerCase().includes('apprenticeship')) {
        router.push(ROUTES.apprenticeshipPrograms);
      } else if (card.cardKey === 'studio-regulars' || card.title.toLowerCase().includes('regular')) {
        router.push(ROUTES.regularPrograms);
      } else {
        router.push(ROUTES.growWithUs);
      }
    },
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
