'use client';

import { ProcessSubpage } from '@/components/blocks/ProcessSubpage';
import { OUR_SERVICES_PROCESS_DATA } from '@/lib/dummy-data/our-process/process-data';
import { PagePublishGate } from '@/components/global/PagePublishGate';

export default function BuildingWithCulturePage() {
  return (
    <PagePublishGate slug="studio/our-process/building-with-culture">
      <ProcessSubpage data={OUR_SERVICES_PROCESS_DATA['building-with-culture']} />
    </PagePublishGate>
  );
}
