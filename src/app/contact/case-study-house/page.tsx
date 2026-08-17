'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingCard } from '@/components/blocks/LandingPage';
import { SubLandingPage } from '@/components/blocks/SubLandingPage';
import { ROUTES } from '@/lib/navigation/routes';
import { CASE_STUDY_HOUSE_CARDS } from '@/dummy-data/contact';

export default function CaseStudyHousePage() {
  const router = useRouter();

  const cards: LandingCard[] = CASE_STUDY_HOUSE_CARDS.map(card => ({
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
      title="the case study house"
      subtitle="explore case study house project types and collaborative offerings"
      isHeaderSticky={true}
    />
  );
}
