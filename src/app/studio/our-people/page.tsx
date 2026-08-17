import type { Metadata } from 'next';
import { PeopleListPage } from '@/components/blocks/PeopleListPage';

export const metadata: Metadata = {
  title: 'ATBPC | Our People',
};

export default function OurPeoplePage() {
  return <PeopleListPage activeFilter="all" />;
}
