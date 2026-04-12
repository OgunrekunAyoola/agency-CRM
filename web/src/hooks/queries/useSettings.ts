import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface AgencySettings {
  name: string;
  taxId: string;
  address: string;
  billingEmail: string;
  currency: string;
  autoInvoice: boolean;
}

const DEFAULT_SETTINGS: AgencySettings = {
  name: '',
  taxId: '',
  address: '',
  billingEmail: '',
  currency: 'USD',
  autoInvoice: false,
};

export const useSettings = () => {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get<AgencySettings>('/api/settings/organization'),
    // Don't retry on 404 — backend endpoint doesn't exist yet
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('404')) return false;
      return failureCount < 2;
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (data: Partial<AgencySettings>) =>
      api.patch<AgencySettings>('/api/settings/organization', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  return {
    settings: settingsQuery.data ?? DEFAULT_SETTINGS,
    isLoading: settingsQuery.isLoading,
    // 404 means the backend endpoint hasn't been implemented yet
    isBackendMissing:
      settingsQuery.error instanceof Error &&
      settingsQuery.error.message.includes('404'),
    error: settingsQuery.error,
    updateSettings: updateSettingsMutation.mutateAsync,
    isSaving: updateSettingsMutation.isPending,
  };
};
