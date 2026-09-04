'use client';

import React from 'react';
import { ProposalFormRoot } from '@/components/forms/ProposalForm/ProposalFormRoot';
import { useFormViewport } from '@/hooks/useFormViewport';

export default function RequestForProposalPage() {
  const isHeightConstrained = useFormViewport(750);

  return (
    <div className={`w-full h-full flex flex-col items-center bg-transparent overflow-y-auto lg:overflow-hidden
      ${isHeightConstrained ? 'px-4 sm:px-6 lg:px-8 pt-2' : 'px-6 sm:px-10 lg:px-12 xl:px-16 2xl:px-20 pt-4'}`}
    >
      <div className="w-full flex-1 flex flex-col min-h-0">
        <ProposalFormRoot />
      </div>
    </div>
  );
}
