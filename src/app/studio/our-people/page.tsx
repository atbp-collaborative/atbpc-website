'use client';

import React, { Suspense } from 'react';
import { getMembers } from '../../../lib/data/members';
import { motion } from 'motion/react';
import { Member } from '../../../types';
import { PeopleCarousel } from '../../../components/PeopleCarousel';

function OurPeoplePageContent() {
  const [members, setMembers] = React.useState<Member[]>([]);

  React.useEffect(() => {
    getMembers().then(setMembers);
  }, []);

  return (
    <motion.div 
      key="our-people"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full flex flex-col justify-between overflow-hidden px-4 sm:px-8 md:px-12 py-3 sm:py-5 max-w-7xl mx-auto select-none"
    >
      <PeopleCarousel members={members} />

      {/* Bottom Subtext Row (2 lines as requested) */}
      <div className="shrink-0 text-center border-t border-space-sparkle/10 pt-2.5 mt-2">
        <p className="text-mini sm:text-caption font-light opacity-80 tracking-wide lowercase">
          we are a licensed, registered collaborative trained and experienced to provide you services ...
        </p>
        <p className="text-mini sm:text-caption font-light opacity-80 tracking-wide lowercase mt-0.5">
          ... architecture, engineering, building construction industry, nationwide.
        </p>
      </div>
    </motion.div>
  );
}

export default function OurPeoplePage() {
  return (
    <Suspense fallback={null}>
      <OurPeoplePageContent />
    </Suspense>
  );
}
