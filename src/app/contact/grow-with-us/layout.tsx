import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ATBPC | Grow With Us',
};

export default function GrowWithUsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
