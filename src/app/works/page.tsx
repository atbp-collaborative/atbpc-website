'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingPage, LandingCard } from '../../components/LandingPage';
import { ROUTES } from '../../lib/routes';
import { WORKS_CATEGORIES } from '../../content/works';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export default function WorksPage() {
  useDocumentTitle('Works');
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
