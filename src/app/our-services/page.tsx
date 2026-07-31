import { OurServicesPage } from '../../views/OurServicesPage';
import { getServices } from '../../lib/data/services';

export default async function Page() {
  const services = await getServices();
  return <OurServicesPage services={services} />;
}
