import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface PortalContract {
  id: string;
  title: string;
  totalAmount: number;
  terms: string;
  status: string;
  signedAt?: string;
  projectId: string;
  createdAt: string;
}

export function useContractPortal(token: string) {
  const queryClient = useQueryClient();

  const contractQuery = useQuery({
    queryKey: ['portal-contract', token],
    queryFn: () => api.get<PortalContract>(`/api/portal/contracts/${token}`),
    enabled: !!token,
  });

  const signMutation = useMutation({
    mutationFn: (digitalSignature: string) => 
      api.post<PortalContract>(`/api/portal/contracts/${token}/sign`, {
        digitalSignature,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-contract', token] });
    },
  });

  const viewMutation = useMutation({
    mutationFn: () => api.post(`/api/portal/contracts/${token}/view`, {}),
  });

  return {
    contract: contractQuery.data,
    isLoading: contractQuery.isLoading,
    error: contractQuery.error,
    sign: signMutation.mutateAsync,
    isSigning: signMutation.isPending,
    markViewed: viewMutation.mutateAsync,
  };
}
