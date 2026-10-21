'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingCard } from '@/components/blocks/LandingPage';
import { SubLandingPage } from '@/components/blocks/SubLandingPage';
import { ROUTES } from '@/lib/navigation/routes';
import { CASE_STUDY_HOUSE_CARDS } from '@/lib/dummy-data/contact/contact-cards';
import { SitePage } from '@/types';

interface CaseStudyHouseClientProps {
  pageInfo?: SitePage | null;
}

export function CaseStudyHouseClient({ pageInfo }: CaseStudyHouseClientProps) {
  const router = useRouter();

  const cards: LandingCard[] = CASE_STUDY_HOUSE_CARDS.map((card, idx) => ({
    id: card.id,
    title: card.title,
    tagline: card.tagline,
    subtext: card.subtext,
    tags: card.tags,
    image: card.image,
    priority: idx < 3,
    onSelect: () => router.push(card.href ?? ROUTES.contact),
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
