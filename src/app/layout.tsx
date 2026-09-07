import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { AppShell } from '@/components/global/AppShell';
import './globals.css';

export const metadata: Metadata = {
  title: 'ATBP Collaborative',
  description:
    'Premium design-build architectural portfolio with high-finesse photography showcase and client qualifying lead funnel.',
  icons: {
    icon: [
      { url: '/icon-light.png', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark.png', type: 'image/png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/apple-icon.png',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const isUnderConstruction = headersList.get('x-under-construction') === 'true';

  return (
    <html lang="en">
      <body>
        <AppShell isUnderConstruction={isUnderConstruction}>{children}</AppShell>
      </body>
    </html>
  );
}
