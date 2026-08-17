'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingPage, LandingCard } from '@/components/blocks/LandingPage';
import { ROUTES } from '@/lib/navigation/routes';
import { WORKS_CATEGORIES } from '@/dummy-data/works';

export default function WorksPage() {
  const router = useRouter();

  const worksCards: LandingCard[] = WORKS_CATEGORIES.map(category => ({
    id: category.id,
    title: category.title,
    tagline: category.tagline,
    image: category.image,
    onSelect: () => router.push(`${ROUTES.works}/${category.id}`),
  }));

  return <LandingPage cards={worksCards} />;
}
