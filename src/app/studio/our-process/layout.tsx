import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ATBPC | Our Process',
};

export default function OurProcessLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
