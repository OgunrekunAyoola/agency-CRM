import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const [clients, leads, offers, projects] = await Promise.all([
        api.get<unknown[]>('/api/clients'),
        api.get<unknown[]>('/api/leads'),
        api.get<unknown[]>('/api/offers'),
        api.get<unknown[]>('/api/projects'),
      ]);
      return {
        clients: clients.length,
        leads: leads.length,
        offers: offers.length,
        projects: projects.length,
      };
    },
  });
};
