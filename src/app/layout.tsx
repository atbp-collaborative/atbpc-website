import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { AppShell } from '@/components/global/AppShell';
import { getSitePagesData } from '@/services/dummy-data.service';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://atbpcollaborative.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'ATBP Collaborative',
    template: '%s | ATBP Collaborative',
  },
  description:
    'Premium design-build architectural portfolio with high-finesse photography showcase and client qualifying lead funnel.',
  keywords: [
    'architecture',
    'architects philippines',
    'design build',
    'construction administration',
    'residential architecture',
    'commercial architecture',
    'ATBP Collaborative',
  ],
  authors: [{ name: 'ATBP Collaborative' }],
  creator: 'ATBP Collaborative',
  icons: {
    icon: [
      { url: '/icon-light.png', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark.png', type: 'image/png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    url: siteUrl,
    siteName: 'ATBP Collaborative',
    title: 'ATBP Collaborative',
    description:
      'Premium design-build architectural portfolio with high-finesse photography showcase and client qualifying lead funnel.',
    images: [
      {
        url: '/charcoal-logo.png',
        width: 1200,
        height: 630,
        alt: 'ATBP Collaborative',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ATBP Collaborative',
    description:
      'Premium design-build architectural portfolio with high-finesse photography showcase and client qualifying lead funnel.',
    images: ['/charcoal-logo.png'],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const isUnderConstruction = headersList.get('x-under-construction') === 'true';
  const sitePages = await getSitePagesData();

  return (
    <html lang="en">
      <body>
        <AppShell isUnderConstruction={isUnderConstruction} sitePages={sitePages}>{children}</AppShell>
      </body>
    </html>
  );
}
