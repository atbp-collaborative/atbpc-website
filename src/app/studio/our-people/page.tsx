import type { Metadata } from 'next';
import { PeopleListPage } from '../../../components/PeopleListPage';

export const metadata: Metadata = {
  title: 'Our People',
};

export default function OurPeoplePage() {
  return <PeopleListPage activeFilter="all" />;
}
