'use client';

import { ProcessSubpage } from '@/components/blocks/ProcessSubpage';
import { OUR_SERVICES_PROCESS_DATA } from '@/lib/dummy-data/our-process/process-data';

export default function DesigningWithValuesPage() {
  return <ProcessSubpage data={OUR_SERVICES_PROCESS_DATA['designing-with-values']} />;
}

