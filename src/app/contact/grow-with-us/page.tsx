'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingCard } from '../../../components/LandingPage';
import { SubLandingPage } from '../../../components/SubLandingPage';
import { ROUTES, TAB_TO_ROUTE } from '../../../lib/routes';
import { GROW_WITH_US_CARDS } from '../../../content/contact';

export default function GrowWithUsPage() {
  const router = useRouter();

  const cards: LandingCard[] = GROW_WITH_US_CARDS.map(card => ({
    id: card.id,
    title: card.title,
    tagline: card.tagline,
    subtext: card.subtext,
    tags: card.tags,
    image: card.image,
    onSelect: () => router.push(TAB_TO_ROUTE[card.tab] ?? ROUTES.contact),
  }));

  return (
    <SubLandingPage
      cards={cards}
      title="grow with us"
      subtitle="career and mentorship opportunities at ATBP Collaborative"
    />
  );
}
