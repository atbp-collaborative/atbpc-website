'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Service, SitePage } from '@/types';
import { getServices, getSitePagesData } from '@/services/dummy-data.service';
import { SubLandingPage } from '@/components/blocks/SubLandingPage';
import { LandingCard } from '@/components/blocks/LandingPage';
import { DraftNotice } from '@/components/global/DraftNotice';
import { ROUTES } from '@/lib/navigation/routes';

export default function OurServicesPage() {
  const [services, setServices] = React.useState<Service[]>([]);
  const [pageInfo, setPageInfo] = React.useState<SitePage | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    getServices().then(setServices);
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

  const cards: LandingCard[] = services.map(service => ({
    id: service.title,
    title: service.title,
    tagline: service.desc,
    subtext: service.desc,
    image: service.image,
    onSelect: () => {
      if (service.title === 'comprehensive design') {
        router.push(ROUTES.comprehensiveServices);
      } else if (service.title === 'piecework services') {
        router.push(ROUTES.pieceworkServices);
      } else if (service.title === 'consultation') {
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
