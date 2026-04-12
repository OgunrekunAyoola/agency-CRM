'use client';

import { useStats } from '@/hooks/queries/useStats';
import { useSettings } from '@/hooks/queries/useSettings';
import { CheckCircle2, Circle, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  complete: boolean;
  href: string;
  cta: string;
}

export function OnboardingChecklist() {
  const [dismissed, setDismissed] = useState(false);
  const { data: stats, isLoading: isStatsLoading } = useStats();
  const { settings, isBackendMissing, isLoading: isSettingsLoading } = useSettings();

  // Don't render while data is resolving to prevent "incomplete" flashes
  if (isStatsLoading || isSettingsLoading) return null;

  // Derived conditions — no new DB tables needed
  const hasSettings =
    !isBackendMissing &&
    Boolean(settings?.billingEmail && settings.billingEmail.length > 0);

  const hasClients = (stats?.totalClientsCount ?? 0) > 0;

  const hasWork =
    (stats?.activeProjectsCount ?? 0) > 0 ||
    (stats?.pendingOffersCount ?? 0) > 0;

  const items: ChecklistItem[] = [
    {
      id: 'settings',
      label: 'Complete your organization profile',
      description: 'Add a billing email and currency to your agency settings.',
      complete: hasSettings,
      href: '/settings',
      cta: 'Go to Settings',
    },
    {
      id: 'clients',
      label: 'Add your first client',
      description: 'Import or create your first active account.',
      complete: hasClients,
      href: '/clients',
      cta: 'Add Client',
    },
    {
      id: 'work',
      label: 'Create a project or offer',
      description: 'Kick off your pipeline with a project or send your first offer.',
      complete: hasWork,
      href: '/offers',
      cta: 'New Offer',
    },
  ];

  const completedCount = items.filter((i) => i.complete).length;
  const allComplete = completedCount === items.length;

  // Don't render if all items are done or the user has dismissed the card
  if (allComplete || dismissed) return null;

  const progressPct = Math.round((completedCount / items.length) * 100);

  return (
    <div
      data-testid="onboarding-checklist"
      className="relative mb-6 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-white p-6 shadow-sm"
    >
      {/* Dismiss */}
      <button
        id="onboarding-dismiss"
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Dismiss onboarding checklist"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Get started — {completedCount}/{items.length} complete
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Complete these steps to unlock the full power of your CRM.
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-5 h-1.5 w-full rounded-full bg-indigo-100">
        <div
          className="h-1.5 rounded-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Items */}
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            data-testid={`checklist-item-${item.id}`}
            className={`flex items-start gap-3 rounded-lg px-4 py-3 transition-colors ${
              item.complete
                ? 'bg-emerald-50/60 opacity-70'
                : 'bg-white shadow-xs border border-gray-100'
            }`}
          >
            {item.complete ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
            ) : (
              <Circle className="mt-0.5 h-5 w-5 shrink-0 text-gray-300" />
            )}
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${item.complete ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                {item.label}
              </p>
              {!item.complete && (
                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
              )}
            </div>
            {!item.complete && (
              <Link
                href={item.href}
                className="inline-flex items-center gap-1 shrink-0 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                {item.cta} <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
