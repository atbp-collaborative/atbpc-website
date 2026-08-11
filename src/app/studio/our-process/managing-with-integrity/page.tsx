'use client';

import { StudioServicesPage } from '@/components/blocks/StudioServicesPage';
import { OUR_SERVICES_PROCESS_DATA } from '@/dummy-data/our-services-process';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function ManagingWithIntegrityPage() {
  useDocumentTitle('Managing with Integrity');
  return <StudioServicesPage data={OUR_SERVICES_PROCESS_DATA['managing-with-integrity']} />;
}
