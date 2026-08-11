import { Member } from '@/types';
import { MEMBERS_DATA } from '@/dummy-data/members';

// Reads from local dummy content today; swap the body for a Supabase/DB/CMS
// call later without changing any calling component.
export async function getMembers(): Promise<Member[]> {
  return MEMBERS_DATA;
}

export async function getMemberById(id: string): Promise<Member | undefined> {
  return MEMBERS_DATA.find((member) => member.id === id);
}
