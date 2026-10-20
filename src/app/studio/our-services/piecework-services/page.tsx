'use client';

import { StudioServicesPage } from '@/components/blocks/StudioServicesPage';
import { OUR_SERVICES_DATA } from '@/lib/dummy-data/our-services/services-data';
import { PagePublishGate } from '@/components/global/PagePublishGate';

export default function PieceworkServicesPage() {
  return (
    <PagePublishGate slug="studio/our-services/piecework-services">
      <StudioServicesPage data={OUR_SERVICES_DATA['piecework-services']} />
    </PagePublishGate>
  );
}
