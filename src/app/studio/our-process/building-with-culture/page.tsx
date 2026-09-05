'use client';

import { ProcessSubpage } from '@/components/blocks/ProcessSubpage';
import { OUR_SERVICES_PROCESS_DATA } from '@/lib/dummy-data/our-process/process-data';

export default function BuildingWithCulturePage() {
  return <ProcessSubpage data={OUR_SERVICES_PROCESS_DATA['building-with-culture']} />;
}

