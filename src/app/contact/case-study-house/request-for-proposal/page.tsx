'use client';

import React from 'react';
import { ProposalFormRoot } from '@/components/forms/ProposalForm/ProposalFormRoot';
import { useFormViewport } from '@/hooks/useFormViewport';

export default function RequestForProposalPage() {
  const isHeightConstrained = useFormViewport(750);

  return (
    <div className={`w-full h-full overflow-y-auto flex flex-col items-center bg-transparent 
      ${isHeightConstrained ? 'p-4 sm:p-6 lg:p-8' : 'p-6 sm:p-10 lg:p-12 xl:p-16 2xl:p-20'}`}
    >
      <div className="w-full max-w-4xl flex-1 flex flex-col">
        <ProposalFormRoot />
      </div>
    </div>
  );
}
