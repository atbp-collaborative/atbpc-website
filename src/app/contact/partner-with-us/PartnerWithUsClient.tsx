'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingCard } from '@/components/blocks/LandingPage';
import { SubLandingPage } from '@/components/blocks/SubLandingPage';
import { ROUTES } from '@/lib/navigation/routes';
import { NavigationCardItem, SitePage } from '@/types';

interface PartnerWithUsClientProps {
  navCards: NavigationCardItem[];
  pageInfo?: SitePage | null;
}

export function PartnerWithUsClient({ navCards, pageInfo }: PartnerWithUsClientProps) {
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
      } else if (card.cardKey === 'suppliers' || card.title.toLowerCase().includes('supplier')) {
        router.push(ROUTES.supplier);
      } else if (card.cardKey === 'consultants' || card.title.toLowerCase().includes('consultant')) {
        router.push(ROUTES.consultant);
      } else if (card.cardKey === 'builders' || card.title.toLowerCase().includes('builder')) {
        router.push(ROUTES.builder);
      } else {
        router.push(ROUTES.partnerWithUs);
      }
    },
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
