import React from 'react';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { StatusNoticeView } from '@/components/global/StatusNoticeView';

export default async function LaunchingSoonPage() {
  const isGatePassActive = process.env.NEXT_PUBLIC_GATE_PASS === 'true';
  const headersList = await headers();
  const isLaunchingSoonHeader = headersList.get('x-launching-soon') === 'true';

  // When the site is live and gate pass is false, direct visits reroute to homepage
  if (!isGatePassActive && !isLaunchingSoonHeader) {
    redirect('/');
  }

  return (
    <StatusNoticeView
      headline="Hello!"
      subtext={
        <>
          <p>We're still working on the finer details and we will be launching soon!</p>
          <p>For inquiries, you may reach out through any of these channels.</p>
        </>
      }
    />
  );
}
