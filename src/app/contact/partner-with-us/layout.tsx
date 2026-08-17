import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ATBPC | Partner With Us',
};

export default function PartnerWithUsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
