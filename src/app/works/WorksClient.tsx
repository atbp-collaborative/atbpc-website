'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingPage, LandingCard } from '@/components/blocks/LandingPage';
import { ROUTES } from '@/lib/navigation/routes';
import { WORKS_CATEGORIES } from '@/lib/dummy-data/works/works';

export function WorksClient() {
  const router = useRouter();

  const worksCards: LandingCard[] = WORKS_CATEGORIES.map((category, idx) => ({
    id: category.id,
    title: category.title,
    tagline: category.tagline,
    image: category.image,
    priority: idx < 3,
    onSelect: () => router.push(`${ROUTES.works}/${category.id}`),
  }));

  return <LandingPage cards={worksCards} />;
}
