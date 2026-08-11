'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingCard } from '@/components/blocks/LandingPage';
import { SubLandingPage } from '@/components/blocks/SubLandingPage';
import { ROUTES } from '@/lib/navigation/routes';
import { GROW_WITH_US_CARDS } from '@/dummy-data/contact';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function GrowWithUsPage() {
  useDocumentTitle('Grow With Us');
  const router = useRouter();

  const cards: LandingCard[] = GROW_WITH_US_CARDS.map(card => ({
    id: card.id,
    title: card.title,
    tagline: card.tagline,
    subtext: card.subtext,
    tags: card.tags,
    image: card.image,
    onSelect: () => router.push(card.href ?? ROUTES.contact),
  }));

  return (
    <SubLandingPage
      cards={cards}
      title="grow with us"
      subtitle="career and mentorship opportunities at ATBP Collaborative"
      isHeaderSticky={true}
    />
  );
}
