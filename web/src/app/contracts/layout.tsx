import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Contracts',
  description: 'Manage client contracts, billing terms, signing status, and generate invoices.',
};
export default function ContractsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
