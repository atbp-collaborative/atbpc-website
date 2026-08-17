'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingCard } from '@/components/blocks/LandingPage';
import { SubLandingPage } from '@/components/blocks/SubLandingPage';
import { ROUTES } from '@/lib/navigation/routes';
import { OUR_PROCESS_CARDS } from '@/dummy-data/our-services-process';

export default function OurProcessPage() {
  const router = useRouter();

  const cards: LandingCard[] = OUR_PROCESS_CARDS.map(card => ({
    id: card.id,
    title: card.title,
    tagline: card.tagline,
    subtext: card.subtext,
    image: card.image,
    onSelect: () => router.push(card.href ?? ROUTES.services),
  }));

  return (
    <SubLandingPage
      cards={cards}
      title="our process"
      subtitle="Purpose-built responses for one-of-a-kind briefs"
      isHeaderSticky={true}
    />
  );
}

