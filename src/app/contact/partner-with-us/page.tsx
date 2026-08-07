'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingCard } from '../../../components/LandingPage';
import { SubLandingPage } from '../../../components/SubLandingPage';
import { ROUTES, TAB_TO_ROUTE } from '../../../lib/routes';
import { PARTNER_WITH_US_CARDS } from '../../../content/contact';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';

export default function PartnerWithUsPage() {
  useDocumentTitle('Partner With Us');
  const router = useRouter();

  const cards: LandingCard[] = PARTNER_WITH_US_CARDS.map(card => ({
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
      title="partner with us"
      subtitle="collaborate with us as a supplier, builder, or consultant"
      isHeaderSticky={true}
    />
  );
}
