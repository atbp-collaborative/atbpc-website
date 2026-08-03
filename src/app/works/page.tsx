'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingPage, LandingCard } from '../../components/LandingPage';
import { ROUTES } from '../../lib/routes';

const shelterImg = '/images/hero_modern_villa_1783495183350.jpg';
const livelihoodImg = '/images/retail_boutique_1783495217375.jpg';
const communityImg = '/images/production_drawings_1783495233053.jpg';

export default function WorksPage() {
  const router = useRouter();

  const worksCards: LandingCard[] = [
    {
      id: 'Shelter',
      title: 'shelter',
      tagline: 'for the way you live',
      image: shelterImg,
      onSelect: () => router.push(`${ROUTES.works}/Shelter`),
    },
    {
      id: 'Livelihood',
      title: 'livelihood',
      tagline: 'where passion takes form',
      image: livelihoodImg,
      onSelect: () => router.push(`${ROUTES.works}/Livelihood`),
    },
    {
      id: 'Community',
      title: 'community',
      tagline: 'we share & communicate',
      image: communityImg,
      onSelect: () => router.push(`${ROUTES.works}/Community`),
    },
  ];

  return <LandingPage cards={worksCards} />;
}
