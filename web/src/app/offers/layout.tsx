import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Offers',
  description: 'Manage sales offers, proposal pipelines, and convert to projects on approval.',
};
export default function OffersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
