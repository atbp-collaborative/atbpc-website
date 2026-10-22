import type { Metadata } from 'next';
import { PeopleListPage } from '@/components/blocks/PeopleListPage';
import { getOurPeopleFooterFromSupabase } from '@/services/supabase/settings.service';

export const metadata: Metadata = {
  title: 'ATBPC | Our People',
};

export const revalidate = 60;

export default async function OurPeoplePage() {
  const footerData = await getOurPeopleFooterFromSupabase();
  return <PeopleListPage activeFilter="all" footerText={footerData?.footerText} />;
}
