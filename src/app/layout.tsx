import type { Metadata } from 'next';
import { AppShell } from '@/components/global/AppShell';
import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s — ATBP Collaborative',
    default: 'ATBP Collaborative',
  },
  description:
    'Premium design-build architectural portfolio with high-finesse photography showcase and client qualifying lead funnel.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon-light.png', type: 'image/png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark.png', type: 'image/png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
