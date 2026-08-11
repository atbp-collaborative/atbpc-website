'use client';

import { StudioServicesPage } from '@/components/blocks/StudioServicesPage';
import { OUR_SERVICES_DATA } from '@/dummy-data/our-services';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function PieceworkServicesPage() {
  useDocumentTitle('Piecework Services');
  return <StudioServicesPage data={OUR_SERVICES_DATA['piecework-services']} />;
}
