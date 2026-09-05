import { CONTACT_INFO, ContactInfo } from '@/lib/dummy-data/contact-info';

export async function getContactInfo(): Promise<ContactInfo> {
  return CONTACT_INFO;
}
