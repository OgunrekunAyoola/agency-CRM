import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Settings',
  description: 'Configure your agency profile, billing settings, and automation preferences.',
};
export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
