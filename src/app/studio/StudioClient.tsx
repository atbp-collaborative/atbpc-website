'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingPage, LandingCard } from '@/components/blocks/LandingPage';
import { NavigationCardItem } from '@/types';
import { ROUTES } from '@/lib/navigation/routes';

interface StudioClientProps {
  navCards: NavigationCardItem[];
}

export function StudioClient({ navCards }: StudioClientProps) {
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
      } else if (card.cardKey === 'services' || card.title.toLowerCase().includes('services')) {
        router.push(ROUTES.ourServices);
      } else if (card.cardKey === 'process' || card.title.toLowerCase().includes('process')) {
        router.push(ROUTES.services);
      } else {
        router.push(ROUTES.ourPeople);
      }
    },
  }));

  return <LandingPage cards={cards} />;
}
