'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingPage, LandingCard } from '@/components/blocks/LandingPage';
import { ROUTES } from '@/lib/navigation/routes';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function ContactPage() {
  useDocumentTitle('Contact');
  const router = useRouter();

  const contactCards: LandingCard[] = [
    {
      id: 'case-study-house',
      title: 'case study house',
      tagline: 'private houses, interiors, & bespoke typologies',
      image: '/images/contact_case_study_house_img_1785469986420.jpg',
      onSelect: () => router.push(ROUTES.caseStudyHouse),
    },
    {
      id: 'grow-with-us',
      title: 'grow with us',
      tagline: 'internship, apprenticeship & studio regulars',
      image: '/images/contact_careers_img_1785470020165.jpg',
      onSelect: () => router.push(ROUTES.growWithUs),
    },
    {
      id: 'partner-with-us',
      title: 'partner with us',
      tagline: 'material suppliers, engineering consultants, & builders',
      image: '/images/contact_partners_img_1785470031164.jpg',
      onSelect: () => router.push(ROUTES.partnerWithUs),
    },
  ];

  return <LandingPage cards={contactCards} />;
}
