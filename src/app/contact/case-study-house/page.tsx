'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingCard } from '../../../components/LandingPage';
import { SubLandingPage } from '../../../components/SubLandingPage';
import { ROUTES, TAB_TO_ROUTE } from '../../../lib/routes';
import { CASE_STUDY_HOUSE_CARDS } from '../../../content/contact';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';

export default function CaseStudyHousePage() {
  useDocumentTitle('Case Study House');
  const router = useRouter();

  const cards: LandingCard[] = CASE_STUDY_HOUSE_CARDS.map(card => ({
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
      title="case study house"
      subtitle="explore case study house project types and collaborative offerings"
      isHeaderSticky={true}
    />
  );
}
