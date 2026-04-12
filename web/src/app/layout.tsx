import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

import { NavbarWrapper } from './components/NavbarWrapper';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { AuthProvider } from '@/hooks/useAuth';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ToasterProvider } from '@/components/providers/ToasterProvider';
import { FailsafeProvider } from '@/components/ui/FailsafeProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Agency CRM',
    template: '%s | Agency CRM',
  },
  description:
    'All-in-one CRM for digital agencies — manage clients, leads, offers, projects, contracts, and invoices from one place.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <QueryProvider>
          <AuthProvider>
            {/* NavbarWrapper hides the nav on /portal/* and /login */}
            <NavbarWrapper />
            <FailsafeProvider>
              <main className="flex-1 container mx-auto px-4 py-8">
                <Breadcrumbs />
                {children}
              </main>
            </FailsafeProvider>
            <ToasterProvider />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
