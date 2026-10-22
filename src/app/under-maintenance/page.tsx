import React from 'react';
import { redirect } from 'next/navigation';
import { headers, cookies } from 'next/headers';
import { UnderMaintenanceView } from '@/components/global/UnderMaintenanceView';
import { getMaintenanceModeAction } from '@/app/actions/super-panel-actions';

interface PageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function UnderMaintenancePage({ searchParams }: PageProps) {
  const isGatePassActive = process.env.NEXT_PUBLIC_GATE_PASS === 'true';
  const resolvedParams = searchParams ? await searchParams : {};
  const modeParam = resolvedParams.mode || resolvedParams.type || resolvedParams.scope;

  const headersList = await headers();
  const maintenanceModeHeader = headersList.get('x-maintenance-mode');
  const isUnderMaintenanceHeader = headersList.get('x-under-maintenance') === 'true';

  const cookieStore = await cookies();
  const siteMaintenanceCookie = cookieStore.get('site_maintenance')?.value;
  const maintenanceEnv = process.env.MAINTENANCE_MODE?.toLowerCase();

  // Check if maintenance mode is active
  let isMaintenanceActive =
    isUnderMaintenanceHeader ||
    siteMaintenanceCookie === 'true' ||
    maintenanceEnv === 'true';

  // If not already detected via headers/cookies/env, check site_settings in DB
  if (!isMaintenanceActive) {
    try {
      const dbMaintenance = await getMaintenanceModeAction();
      if (dbMaintenance.enabled) {
        isMaintenanceActive = true;
      }
    } catch {
      // Ignore DB read failure
    }
  }

  // When the site is live (maintenance mode is false) and gate pass is false, reroute to homepage
  if (!isGatePassActive && !isMaintenanceActive) {
    redirect('/');
  }

  // Determine display mode:
  // 1. Explicit override via query parameter (?mode=page or ?mode=site-wide)
  // 2. Middleware header
  // 3. Site maintenance state
  let isSiteWide = true;

  if (modeParam === 'page' || modeParam === 'per-page') {
    isSiteWide = false;
  } else if (modeParam === 'site' || modeParam === 'site-wide') {
    isSiteWide = true;
  } else if (maintenanceModeHeader === 'site-wide') {
    isSiteWide = true;
  } else if (maintenanceModeHeader === 'per-page') {
    isSiteWide = false;
  } else if (isMaintenanceActive) {
    isSiteWide = true;
  } else {
    isSiteWide = false;
  }

  return (
    <UnderMaintenanceView
      mode={isSiteWide ? 'site-wide' : 'page'}
      isEmbedded={false}
    />
  );
}
