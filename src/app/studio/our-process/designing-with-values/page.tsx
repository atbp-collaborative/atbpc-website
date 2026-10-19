'use client';

import { ProcessSubpage } from '@/components/blocks/ProcessSubpage';
import { OUR_SERVICES_PROCESS_DATA } from '@/lib/dummy-data/our-process/process-data';
import { PagePublishGate } from '@/components/global/PagePublishGate';

export default function DesigningWithValuesPage() {
  return (
    <PagePublishGate slug="studio/our-process/designing-with-values">
      <ProcessSubpage data={OUR_SERVICES_PROCESS_DATA['designing-with-values']} />
    </PagePublishGate>
  );
}
