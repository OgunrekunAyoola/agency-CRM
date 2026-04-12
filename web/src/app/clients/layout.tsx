import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Clients',
  description: 'Manage your agency clients, billing tiers, and account relationships.',
};
export default function ClientsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
