import { CONTACT_INFO, ContactInfo } from '@/dummy-data/contact-info';

export async function getContactInfo(): Promise<ContactInfo> {
  return CONTACT_INFO;
}
