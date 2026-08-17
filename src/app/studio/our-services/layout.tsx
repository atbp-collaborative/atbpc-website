import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ATBPC | Our Services',
};

export default function OurServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
