import { notFound } from 'next/navigation';
import { PeopleListPage } from '../../../../../components/PeopleListPage';
import { MemberCategory } from '../../../../../types';

const VALID_CATEGORIES: MemberCategory[] = ['designers', 'managers', 'builders'];

function isMemberCategory(value: string): value is MemberCategory {
  return (VALID_CATEGORIES as string[]).includes(value);
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  if (!isMemberCategory(category)) {
    notFound();
  }

  return <PeopleListPage activeFilter={category} />;
}
