'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingCard } from '@/components/blocks/LandingPage';
import { SubLandingPage } from '@/components/blocks/SubLandingPage';
import { ROUTES } from '@/lib/navigation/routes';
import { NavigationCardItem, SitePage } from '@/types';

interface CaseStudyHouseClientProps {
  navCards: NavigationCardItem[];
  pageInfo?: SitePage | null;
}

export function CaseStudyHouseClient({ navCards, pageInfo }: CaseStudyHouseClientProps) {
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
      } else if (card.cardKey === 'discovery' || card.title.toLowerCase().includes('discovery')) {
        router.push(ROUTES.discoverySession);
      } else if (card.cardKey === 'request-proposal' || card.title.toLowerCase().includes('proposal')) {
        router.push(ROUTES.requestForProposal);
      } else {
        router.push(ROUTES.contact);
      }
    },
  }));

  const subtitle = pageInfo?.subtitle || 'explore case study house project types and collaborative offerings';

  return (
    <SubLandingPage
      cards={cards}
      title="the case study house"
      subtitle={subtitle}
      isHeaderSticky={true}
    />
  );
}
