import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Analytics',
  description: 'Agency-wide ROI analytics, ad spend tracking, and project profitability insights.',
};
export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
