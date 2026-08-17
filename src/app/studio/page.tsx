'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingPage, LandingCard } from '@/components/blocks/LandingPage';
import { ROUTES } from '@/lib/navigation/routes';

export default function StudioPage() {
  const router = useRouter();

  const studioCards: LandingCard[] = [
    {
      id: 'services',
      title: 'services',
      tagline: 'comprehensive & piecework services',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop',
      onSelect: () => router.push(ROUTES.ourServices),
    },
    {
      id: 'process',
      title: 'process',
      tagline: 'design, manage, build with integrity',
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2071&auto=format&fit=crop',
      onSelect: () => router.push(ROUTES.services),
    },
    {
      id: 'people',
      title: 'people',
      tagline: 'our designers, managers & builders',
      image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop',
      onSelect: () => router.push(ROUTES.ourPeople),
    },
  ];

  return <LandingPage cards={studioCards} />;
}
