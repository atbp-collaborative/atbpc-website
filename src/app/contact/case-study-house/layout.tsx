import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ATBPC | Case Study House',
};

export default function CaseStudyHouseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
