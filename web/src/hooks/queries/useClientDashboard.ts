import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface ClientDashboard {
  id: string;
  name: string;
  legalName: string;
  industry: string;
  businessAddress: string;
  activeProjectsCount: number;
  openLeadsCount: number;
  pendingOffersCount: number;
  totalInvoiced: number;
  totalPaid: number;
  totalOutstanding: number;
  totalAdSpend: number;
}

export const useClientDashboard = (clientId: string) => {
  return useQuery<ClientDashboard>({
    queryKey: ['client-dashboard', clientId],
    queryFn: () => api.get<ClientDashboard>(`/api/clients/${clientId}/dashboard`),
    enabled: !!clientId,
  });
};
