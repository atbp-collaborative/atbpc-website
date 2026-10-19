'use client';

import { ProcessSubpage } from '@/components/blocks/ProcessSubpage';
import { OUR_SERVICES_PROCESS_DATA } from '@/lib/dummy-data/our-process/process-data';
import { PagePublishGate } from '@/components/global/PagePublishGate';

export default function ManagingWithIntegrityPage() {
  return (
    <PagePublishGate slug="studio/our-process/managing-with-integrity">
      <ProcessSubpage data={OUR_SERVICES_PROCESS_DATA['managing-with-integrity']} />
    </PagePublishGate>
  );
}
