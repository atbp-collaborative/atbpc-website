'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { NavigationCardItem, SitePage } from '@/types';
import { SubLandingPage } from '@/components/blocks/SubLandingPage';
import { LandingCard } from '@/components/blocks/LandingPage';
import { ROUTES } from '@/lib/navigation/routes';

interface OurServicesClientProps {
  navCards: NavigationCardItem[];
  pageInfo?: SitePage | null;
}

export function OurServicesClient({ navCards, pageInfo }: OurServicesClientProps) {
  const router = useRouter();

  const cards: LandingCard[] = navCards.map((card, idx) => ({
    id: card.id,
    title: card.title,
    tagline: card.tagline,
    subtext: card.subtext,
    footerText: card.footerText,
    image: card.imageUrl,
    priority: idx < 3,
    onSelect: () => {
      if (card.targetHref) {
        router.push(card.targetHref);
      } else if (card.cardKey === 'comprehensive-services' || card.title.includes('comprehensive')) {
        router.push(ROUTES.comprehensiveServices);
      } else if (card.cardKey === 'piecework-services' || card.title.includes('piecework')) {
        router.push(ROUTES.pieceworkServices);
      } else {
        router.push(ROUTES.consultationRetainerServices);
      }
    },
  }));

  const subtitle =
    pageInfo?.subtitle ||
    'Discover our flexible contract types and comprehensive architectural capabilities designed to bring clarity and integrity to your project.';

  return (
    <SubLandingPage
      cards={cards}
      title="our services"
      subtitle={subtitle}
      isHeaderSticky={true}
    />
  );
}
