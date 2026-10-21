'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingPage, LandingCard } from '@/components/blocks/LandingPage';
import { NavigationCardItem } from '@/types';
import { ROUTES } from '@/lib/navigation/routes';

interface ContactClientProps {
  navCards: NavigationCardItem[];
}

export function ContactClient({ navCards }: ContactClientProps) {
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
      } else if (card.cardKey.includes('case-study-house') || card.title.toLowerCase().includes('case study')) {
        router.push(ROUTES.caseStudyHouse);
      } else if (card.cardKey.includes('grow-with-us') || card.title.toLowerCase().includes('grow')) {
        router.push(ROUTES.growWithUs);
      } else {
        router.push(ROUTES.partnerWithUs);
      }
    },
  }));

  return <LandingPage cards={cards} />;
}
