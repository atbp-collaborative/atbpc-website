'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { getMembers } from '@/services/dummy-data.service';
import { Member, MemberCategory } from '@/types';
import { PeopleCarousel } from '@/components/blocks/PeopleCarousel';
import { PersonCardSkeleton } from '@/components/primitives/skeletons/PersonCardSkeleton';
import { getOurPeopleFooterFromSupabase } from '@/services/supabase/settings.service';

const DEFAULT_FOOTER_TEXT =
  'we are a licensed, registered collaborative trained and experienced to provide you services ... architecture, engineering, building construction industry, nationwide.';

export interface PeopleListPageProps {
  activeFilter: 'all' | MemberCategory;
  footerText?: string;
}

function PeopleListPageContent({ activeFilter, footerText: initialFooter }: PeopleListPageProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [footerText, setFooterText] = useState<string>(initialFooter || DEFAULT_FOOTER_TEXT);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMembers()
      .then(setMembers)
      .finally(() => setIsLoading(false));

    if (!initialFooter) {
      getOurPeopleFooterFromSupabase().then((data) => {
        if (data?.footerText) {
          setFooterText(data.footerText);
        }
      });
    }
  }, [initialFooter]);

  if (isLoading) {
    return (
      <div className="w-full flex-1 flex flex-col justify-between md:overflow-hidden px-4 sm:px-8 md:px-12 py-3 sm:py-5 select-none">
        <PersonCardSkeleton />
      </div>
    );
  }

  return (
    <div
      className="w-full flex-1 flex flex-col justify-between md:overflow-hidden px-4 sm:px-8 md:px-12 py-3 sm:py-5 select-none"
    >
      <PeopleCarousel members={members} activeFilter={activeFilter} />

      {/* Bottom Subtext Row */}
      <div className="shrink-0 text-center pt-2 mt-1">
        <p className="text-micro sm:text-mini font-light opacity-75 tracking-wide italic">
          {footerText || DEFAULT_FOOTER_TEXT}
        </p>
      </div>
    </div>
  );
}

export function PeopleListPage(props: PeopleListPageProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full flex-1 px-4 sm:px-8 md:px-12 py-3 sm:py-5">
          <PersonCardSkeleton />
        </div>
      }
    >
      <PeopleListPageContent {...props} />
    </Suspense>
  );
}
