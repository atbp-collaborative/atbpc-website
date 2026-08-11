import { Service } from '@/types';
import { SERVICES_DATA } from '@/dummy-data/design-services';

// Reads from local dummy content today; swap the body for a Supabase/DB/CMS
// call later without changing any calling component.
export async function getServices(): Promise<Service[]> {
  return SERVICES_DATA;
}
