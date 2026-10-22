'use client';

import React from 'react';
import { StatusNoticeView } from './StatusNoticeView';

export interface UnderMaintenanceViewProps {
  mode?: 'site-wide' | 'page';
  isEmbedded?: boolean;
}

export const UnderMaintenanceView: React.FC<UnderMaintenanceViewProps> = ({
  mode = 'site-wide',
  isEmbedded = false,
}) => {
  const isSiteWide = mode === 'site-wide';

  const headline = isSiteWide ? "we're on a quick break" : "pardon the dust!";

  const subtext = isSiteWide ? (
    <>
      <p>We're currently doing some construction works behind the scenes. We will be operational soon!</p>
      <p>For inquiries, you may reach out through any of these channels.</p>
    </>
  ) : (
    <>
      <p>This page is undergoing quick retouches and will be back shortly.</p>
      <p>For inquiries, you may reach out through any of these channels.</p>
    </>
  );

  return (
    <StatusNoticeView
      headline={headline}
      subtext={subtext}
      isEmbedded={isEmbedded}
    />
  );
};
