'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Service } from '../../../types';
import { getServices } from '../../../lib/data/services';
import { SubLandingPage } from '../../../components/SubLandingPage';
import { LandingCard } from '../../../components/LandingPage';
import { ROUTES } from '../../../lib/routes';

export default function OurServicesPage() {
  const [services, setServices] = React.useState<Service[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    getServices().then(setServices);
  }, []);

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
      }
    },
  }));

  return (
    <SubLandingPage 
      cards={cards} 
      title="our services" 
      subtitle="Discover our flexible contract types and comprehensive architectural capabilities designed to bring clarity and integrity to your project."
      isHeaderSticky={true}
    />
  );
}
