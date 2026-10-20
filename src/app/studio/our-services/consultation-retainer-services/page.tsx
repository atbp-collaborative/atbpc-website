'use client';

import { StudioServicesPage } from '@/components/blocks/StudioServicesPage';
import { OUR_SERVICES_DATA } from '@/lib/dummy-data/our-services/services-data';
import { PagePublishGate } from '@/components/global/PagePublishGate';

export default function ConsultationRetainerServicesPage() {
  return (
    <PagePublishGate slug="studio/our-services/consultation-retainer-services">
      <StudioServicesPage data={OUR_SERVICES_DATA['consultation-retainer-services']} />
    </PagePublishGate>
  );
}
