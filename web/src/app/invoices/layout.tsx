import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Invoices',
  description: 'Track invoices, record payments, and manage billing status across all clients.',
};
export default function InvoicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
