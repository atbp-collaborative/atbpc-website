'use client';

import { ProcessSubpage } from '@/components/blocks/ProcessSubpage';
import { OUR_SERVICES_PROCESS_DATA } from '@/dummy-data/our-services-process';

export default function ManagingWithIntegrityPage() {
  return <ProcessSubpage data={OUR_SERVICES_PROCESS_DATA['managing-with-integrity']} />;
}

