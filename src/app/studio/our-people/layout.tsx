import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ATBPC | Our People',
};

export default function OurPeopleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
