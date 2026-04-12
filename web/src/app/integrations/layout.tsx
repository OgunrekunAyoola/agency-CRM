import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Integrations',
  description: 'Connect Meta Ads, Google Ads, and TikTok to automatically import leads and metrics.',
};
export default function IntegrationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
