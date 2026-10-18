'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LandingPage, LandingCard } from '@/components/blocks/LandingPage';
import { DraftNotice } from '@/components/global/DraftNotice';
import { ROUTES } from '@/lib/navigation/routes';
import { WORKS_CATEGORIES } from '@/lib/dummy-data/works/works';
import { getSitePagesData } from '@/services/dummy-data.service';
import { SitePage } from '@/types';

export default function WorksPage() {
  const [pageInfo, setPageInfo] = React.useState<SitePage | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    getSitePagesData().then((pages) => {
      const p = pages.find((page) => page.id === 'works');
      if (p) setPageInfo(p);
    });
  }, []);

  if (pageInfo && pageInfo.isDraft) {
    return (
      <DraftNotice
        pageTitle={pageInfo.title || 'Works'}
        subtitle={pageInfo.subtitle}
      />
    );
  }

  const worksCards: LandingCard[] = WORKS_CATEGORIES.map(category => ({
    id: category.id,
    title: category.title,
    tagline: category.tagline,
    image: category.image,
    onSelect: () => router.push(`${ROUTES.works}/${category.id}`),
  }));

  return <LandingPage cards={worksCards} />;
}
