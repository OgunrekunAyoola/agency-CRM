import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Leads',
  description: 'Track and manage incoming sales leads, pipeline stages, and deal values.',
};
export default function LeadsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
