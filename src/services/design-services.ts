import { Service } from '@/types';
import { SERVICES_DATA } from '@/lib/dummy-data/our-services/services-data';

// Reads from local dummy content today; swap the body for a Supabase/DB/CMS
// call later without changing any calling component.
export async function getServices(): Promise<Service[]> {
  return SERVICES_DATA;
}
