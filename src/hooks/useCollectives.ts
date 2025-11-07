import { useQuery } from '@tanstack/react-query';
import { collectivesService, CollectiveFilters } from '@/api';

export const useCollectives = (filters?: CollectiveFilters) => {
  return useQuery({
    queryKey: ['collectives', filters],
    queryFn: () => collectivesService.getAll(filters),
  });
};

export const useCollective = (id: string) => {
  return useQuery({
    queryKey: ['collective', id],
    queryFn: () => collectivesService.getById(id),
    enabled: !!id,
  });
};
