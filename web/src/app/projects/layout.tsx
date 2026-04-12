import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Projects',
  description: 'Manage client projects, track time, ad metrics, and team performance.',
};
export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
