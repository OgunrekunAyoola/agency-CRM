import { redirect } from 'next/navigation';

/**
 * Root route — redirect authenticated users to the dashboard.
 * Middleware handles the unauthenticated case by redirecting to /login first,
 * so any user who reaches this server component is already authenticated.
 */
export default function RootPage() {
  redirect('/dashboard');
}
