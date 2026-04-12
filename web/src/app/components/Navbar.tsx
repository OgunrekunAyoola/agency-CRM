'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { MobileDrawer } from './MobileDrawer';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  FileText,
  Briefcase,
  CheckSquare,
  FileSignature,
  Receipt,
  Settings,
  Plug,
  BarChart3,
  Menu,
  LogOut,
} from 'lucide-react';

export const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/leads', label: 'Leads', icon: TrendingUp },
  { href: '/offers', label: 'Offers', icon: FileText },
  { href: '/projects', label: 'Projects', icon: Briefcase },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/contracts', label: 'Contracts', icon: FileSignature },
  { href: '/invoices', label: 'Invoices', icon: Receipt },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/integrations', label: 'Integrations', icon: Plug },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-6">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-lg hidden sm:block">Agency CRM</span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1 flex-1 overflow-x-auto">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive(href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Right side: user info + logout (desktop) / hamburger (mobile) */}
            <div className="flex items-center gap-3 shrink-0">
              {/* User display — desktop */}
              {user && (
                <span className="hidden lg:block text-sm text-muted-foreground">
                  {user.fullName || user.email}
                </span>
              )}

              {/* Logout button — desktop */}
              <button
                onClick={() => logout()}
                className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>

              {/* Hamburger — mobile only */}
              <button
                onClick={() => setIsMobileOpen(true)}
                className="flex lg:hidden items-center justify-center h-10 w-10 rounded-md hover:bg-muted transition-colors"
                aria-label="Open navigation menu"
                aria-expanded={isMobileOpen}
                aria-controls="mobile-nav-drawer"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <MobileDrawer
        id="mobile-nav-drawer"
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        navItems={NAV_ITEMS}
        currentPath={pathname}
        user={user}
        onLogout={() => {
          setIsMobileOpen(false);
          logout();
        }}
      />
    </>
  );
}

export default Navbar;
