'use client';

import React from 'react';
import { StatusNoticeView } from './StatusNoticeView';

interface UnderConstructionViewProps {
  isEmbedded?: boolean;
}

export const UnderConstructionView: React.FC<UnderConstructionViewProps> = ({ isEmbedded = false }) => {
  return (
    <StatusNoticeView
      isEmbedded={isEmbedded}
      headline="Hello!"
      subtext={
        <>
          <p>We're still working on the finer details and we will be launching soon!</p>
          <p>For inquiries, you may reach out through any of these channels.</p>
        </>
      }
    />
  );
};
