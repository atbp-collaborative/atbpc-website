import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ATBPC | Works',
};

export default function WorksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
