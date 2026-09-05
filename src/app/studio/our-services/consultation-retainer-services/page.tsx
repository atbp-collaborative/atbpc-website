'use client';

import { StudioServicesPage } from '@/components/blocks/StudioServicesPage';
import { OUR_SERVICES_DATA } from '@/lib/dummy-data/our-services';

export default function ConsultationRetainerServicesPage() {
  return <StudioServicesPage data={OUR_SERVICES_DATA['consultation-retainer-services']} />;
}
