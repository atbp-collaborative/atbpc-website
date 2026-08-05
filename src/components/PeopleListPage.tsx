'use client';

import React, { Suspense } from 'react';
import { getMembers } from '../lib/data/members';
import { motion } from 'motion/react';
import { Member, MemberCategory } from '../types';
import { PeopleCarousel } from './PeopleCarousel';

export interface PeopleListPageProps {
  activeFilter: 'all' | MemberCategory;
}

function PeopleListPageContent({ activeFilter }: PeopleListPageProps) {
  const [members, setMembers] = React.useState<Member[]>([]);

  React.useEffect(() => {
    getMembers().then(setMembers);
  }, []);

  return (
    <motion.div
      key="people"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full flex flex-col justify-between overflow-hidden px-4 sm:px-8 md:px-12 py-3 sm:py-5 select-none"
    >
      <PeopleCarousel members={members} activeFilter={activeFilter} />

      {/* Bottom Subtext Row */}
      <div className="shrink-0 text-center border-t border-space-sparkle/10 pt-2 mt-1">
        <p className="text-micro sm:text-mini font-light opacity-75 tracking-wide italic">
          we are a licensed, registered collaborative trained and experienced to provide you services ... architecture, engineering, building construction industry, nationwide.
        </p>
      </div>
    </motion.div>
  );
}

export function PeopleListPage(props: PeopleListPageProps) {
  return (
    <Suspense fallback={null}>
      <PeopleListPageContent {...props} />
    </Suspense>
  );
}
