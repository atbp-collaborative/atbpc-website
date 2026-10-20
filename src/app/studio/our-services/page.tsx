'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { NavigationCardItem, SitePage } from '@/types';
import { getNavigationCardsData, getSitePagesData } from '@/services/dummy-data.service';
import { SubLandingPage } from '@/components/blocks/SubLandingPage';
import { LandingCard } from '@/components/blocks/LandingPage';
import { DraftNotice } from '@/components/global/DraftNotice';
import { ROUTES } from '@/lib/navigation/routes';

export default function OurServicesPage() {
  const [navCards, setNavCards] = React.useState<NavigationCardItem[]>([]);
  const [pageInfo, setPageInfo] = React.useState<SitePage | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    getNavigationCardsData('services').then(setNavCards);
    getSitePagesData().then((pages) => {
      const p = pages.find((page) => page.id === 'services-hub');
      if (p) setPageInfo(p);
    });
  }, []);

  if (pageInfo && pageInfo.isDraft) {
    return (
      <DraftNotice
        pageTitle={pageInfo.title || 'Our Services'}
        subtitle={pageInfo.subtitle}
      />
    );
  }

  const cards: LandingCard[] = navCards.map((card) => ({
    id: card.id,
    title: card.title,
    tagline: card.tagline,
    subtext: card.subtext,
    image: card.imageUrl,
    onSelect: () => {
      if (card.targetHref) {
        router.push(card.targetHref);
      } else if (card.cardKey === 'comprehensive-services' || card.title.includes('comprehensive')) {
        router.push(ROUTES.comprehensiveServices);
      } else if (card.cardKey === 'piecework-services' || card.title.includes('piecework')) {
        router.push(ROUTES.pieceworkServices);
      } else {
        router.push(ROUTES.consultationRetainerServices);
      }
    },
  }));

  const subtitle =
    pageInfo?.subtitle ||
    'Discover our flexible contract types and comprehensive architectural capabilities designed to bring clarity and integrity to your project.';

  return (
    <SubLandingPage 
      cards={cards} 
      title="our services" 
      subtitle={subtitle}
      isHeaderSticky={true}
    />
  );
}
