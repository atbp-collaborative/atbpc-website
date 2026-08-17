import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PeopleListPage } from '@/components/blocks/PeopleListPage';
import { MemberCategory } from '@/types';

const VALID_CATEGORIES: MemberCategory[] = ['designers', 'managers', 'builders'];

const CATEGORY_TITLES: Record<MemberCategory, string> = {
  designers: 'Designers',
  managers: 'Managers',
  builders: 'Builders',
};

function isMemberCategory(value: string): value is MemberCategory {
  return (VALID_CATEGORIES as string[]).includes(value);
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  return { title: isMemberCategory(category) ? 'ATBPC | Our People' : undefined };
}

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;

  if (!isMemberCategory(category)) {
    notFound();
  }

  return <PeopleListPage activeFilter={category} />;
}
