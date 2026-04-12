import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Tasks',
  description: 'View and manage all tasks across your agency projects.',
};
export default function TasksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
