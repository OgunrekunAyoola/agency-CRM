import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface StatsResponse {
  totalRevenue: number;
  totalAdSpend: number;
  activeProjectsCount: number;
  totalClientsCount: number;
  activeLeadsCount: number;
  pendingOffersCount: number;
}

/**
 * Fetches pre-aggregated dashboard stats from GET /api/stats.
 *
 * Previously this hook made 4 separate list requests (clients, leads, offers,
 * projects) and called .length on each array. That pattern transfered full
 * entity lists across the wire just to count them.
 *
 * The backend now returns scalar counts via a single DB-side aggregation query.
 */
export const useStats = () => {
  return useQuery<StatsResponse>({
    queryKey: ['stats'],
    queryFn: () => api.get<StatsResponse>('/api/stats'),
  });
};
