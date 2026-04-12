import type { Metadata } from 'next';
import DashboardPageClient from './DashboardPageClient';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Agency performance overview — revenue, leads, active projects, and ad spend at a glance.',
};

export default function DashboardPage() {
  return <DashboardPageClient />;
}
