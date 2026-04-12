'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';

// Routes where the CRM Navbar must NOT appear (public-facing pages)
const NAVBAR_EXCLUDED_PREFIXES = ['/portal', '/login'];

/**
 * NavbarWrapper renders the Navbar only on authenticated CRM routes.
 * This is implemented as a client component (to access usePathname) rather
 * than a route group restructure, avoiding the need to move 15+ page files.
 */
export function NavbarWrapper() {
  const pathname = usePathname();
  const shouldHide = NAVBAR_EXCLUDED_PREFIXES.some((prefix) => pathname?.startsWith(prefix));

  if (shouldHide) return null;
  return <Navbar />;
}
