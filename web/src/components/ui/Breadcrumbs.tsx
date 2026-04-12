'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Maps known route segments to human-readable labels.
 * UUIDs are detected and replaced with contextual labels.
 */
const SEGMENT_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  clients: 'Clients',
  leads: 'Leads',
  offers: 'Offers',
  projects: 'Projects',
  tasks: 'Tasks',
  contracts: 'Contracts',
  invoices: 'Invoices',
  analytics: 'Analytics',
  integrations: 'Integrations',
  settings: 'Settings',
  automation: 'Automation',
  portal: 'Portal',
  'forgot-password': 'Forgot Password',
};

/** UUID v4 pattern */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** Short MongoDB-style hex IDs */
const SHORT_ID_RE = /^[0-9a-f]{20,}$/i;

function formatSegment(segment: string): string {
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];
  if (UUID_RE.test(segment) || SHORT_ID_RE.test(segment)) return 'Details';
  // Convert kebab-case / snake_case to Title Case
  return segment
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  if (paths.length === 0 || pathname === '/dashboard') return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center space-x-2 text-xs font-medium text-slate-500 mb-6 bg-slate-50 w-fit px-3 py-1.5 rounded-full border shadow-sm"
    >
      <Link href="/dashboard" className="flex items-center hover:text-indigo-600 transition-colors">
        <Home className="w-3 h-3 mr-1" aria-hidden="true" />
        <span>Home</span>
      </Link>

      {paths.map((segment, index) => {
        const href = `/${paths.slice(0, index + 1).join('/')}`;
        const isLast = index === paths.length - 1;
        const label = formatSegment(segment);

        return (
          <div key={`${segment}-${index}`} className="flex items-center space-x-2">
            <ChevronRight className="w-3 h-3 text-slate-400" aria-hidden="true" />
            {isLast ? (
              <span className="text-slate-900 font-bold" aria-current="page">
                {label}
              </span>
            ) : (
              <Link href={href} className="hover:text-indigo-600 transition-colors">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
