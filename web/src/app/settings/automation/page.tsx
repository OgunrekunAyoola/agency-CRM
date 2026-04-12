'use client';

import { useAutomation } from '@/hooks/queries/useAutomation';
import { useProjects } from '@/hooks/queries/useProjects';
import { useState } from 'react';
import {
  Zap,
  AlertCircle,
  Info,
  CheckCircle2,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { toast } from 'sonner';

export default function AutomationSettingsPage() {
  const { runMonthlyBilling, isRunningBilling, syncAdMetrics, isSyncing } = useAutomation();
  const { projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState('');

  const projectOptions = [
    { label: 'Select a project to sync...', value: '' },
    ...projects.map((p) => ({ label: p.name, value: p.id })),
  ];

  const handleRunBilling = async () => {
    try {
      const result = await runMonthlyBilling();
      toast.success(result?.message ?? 'Monthly billing job triggered.');
    } catch {
      toast.error('Failed to trigger monthly billing.');
    }
  };

  const handleSyncMetrics = async () => {
    if (!selectedProjectId) {
      toast.error('Please select a project first.');
      return;
    }
    try {
      const result = await syncAdMetrics(selectedProjectId);
      toast.success(result?.message ?? 'Ad metrics sync triggered.');
    } catch {
      toast.error('Failed to trigger ad metrics sync.');
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Zap className="h-8 w-8 text-indigo-600" />
            Automation Engine
          </h1>
          <p className="text-gray-500 mt-2">
            Manually trigger automation jobs or monitor active system rules.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Manual Triggers */}
        <div className="lg:col-span-2 space-y-6">
          {/* Monthly Billing */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-indigo-500" />
                Monthly Invoice Generation
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Manually trigger the end-of-month invoice generation cycle for all active retainer contracts.
              </p>
            </div>
            <div className="p-6">
              <Button
                onClick={handleRunBilling}
                isLoading={isRunningBilling}
                variant="outline"
                className="gap-2"
              >
                {isRunningBilling ? (
                  <Clock className="h-4 w-4 animate-spin" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                Run Monthly Billing
              </Button>
            </div>
          </div>

          {/* Ad Metrics Sync */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Zap className="h-5 w-5 text-indigo-500" />
                Ad Metrics Sync
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Manually trigger an ad metrics synchronisation for a specific project&apos;s linked accounts.
              </p>
            </div>
            <div className="p-6 space-y-4">
              <Select
                label="Project"
                options={projectOptions}
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              />
              <Button
                onClick={handleSyncMetrics}
                isLoading={isSyncing}
                variant="outline"
                className="gap-2"
                disabled={!selectedProjectId}
              >
                <RefreshCw className="h-4 w-4" />
                Sync Ad Metrics
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar — active system automations */}
        <div className="space-y-6">
          <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Active Automations
            </h3>
            <ul className="space-y-4 text-sm text-indigo-100">
              <li className="flex gap-3">
                <div className="h-5 w-5 bg-indigo-800 rounded flex items-center justify-center shrink-0 text-xs font-bold">
                  1
                </div>
                <p>
                  <span className="text-white font-medium">Offer Acceptance:</span> Auto-creates
                  Project, Contract (Draft), and Tasks based on line items.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="h-5 w-5 bg-indigo-800 rounded flex items-center justify-center shrink-0 text-xs font-bold">
                  2
                </div>
                <p>
                  <span className="text-white font-medium">Monthly Billing:</span> Scheduled
                  end-of-month invoice generation for active retainers.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="h-5 w-5 bg-indigo-800 rounded flex items-center justify-center shrink-0 text-xs font-bold">
                  3
                </div>
                <p>
                  <span className="text-white font-medium">Ad Metrics:</span> Daily batch sync
                  from Google / Meta / TikTok stubs.
                </p>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl">
            <h3 className="text-amber-900 font-semibold mb-2 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Note
            </h3>
            <p className="text-sm text-amber-800 leading-relaxed">
              These triggers run the same background jobs the scheduler runs automatically.
              Use them during testing or to recover from a missed schedule window.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
