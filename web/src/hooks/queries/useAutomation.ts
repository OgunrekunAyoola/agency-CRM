import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

/**
 * useAutomation — wraps the two real automation endpoints exposed by the backend.
 *
 * Actual backend routes (AutomationController.cs, Route: "api/automation"):
 *   POST /api/automation/run-monthly-billing
 *   POST /api/automation/sync-ad-metrics?projectId=<uuid>
 *
 * There is NO /templates endpoint on the backend. The previous hook was calling
 * non-existent endpoints and accessing `.data` on the raw JSON response (which
 * api.ts does NOT return — it returns the parsed payload directly).
 * Both bugs have been corrected here.
 */

export const useAutomation = () => {
  const runMonthlyBillingMutation = useMutation({
    mutationFn: () => api.post<{ message: string }>('/api/automation/run-monthly-billing'),
  });

  const syncAdMetricsMutation = useMutation({
    mutationFn: (projectId: string) =>
      api.post<{ message: string }>(
        `/api/automation/sync-ad-metrics?projectId=${projectId}`,
      ),
  });

  return {
    runMonthlyBilling: runMonthlyBillingMutation.mutateAsync,
    isRunningBilling: runMonthlyBillingMutation.isPending,
    syncAdMetrics: syncAdMetricsMutation.mutateAsync,
    isSyncing: syncAdMetricsMutation.isPending,
  };
};
