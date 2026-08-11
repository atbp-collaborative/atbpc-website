'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingCard } from '@/components/blocks/LandingPage';
import { SubLandingPage } from '@/components/blocks/SubLandingPage';
import { ROUTES } from '@/lib/navigation/routes';
import { PARTNER_WITH_US_CARDS } from '@/dummy-data/contact';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function PartnerWithUsPage() {
  useDocumentTitle('Partner With Us');
  const router = useRouter();

  const cards: LandingCard[] = PARTNER_WITH_US_CARDS.map((card) => ({
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
      title="partner with us"
      subtitle="collaborate with us as a supplier, builder, or consultant"
      isHeaderSticky={true}
    />
  );
}
