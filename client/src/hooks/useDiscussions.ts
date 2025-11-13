import { useQuery } from '@tanstack/react-query';
import { discussionsService, DiscussionFilters } from '@/api';

export const useDiscussions = (filters?: DiscussionFilters) => {
  return useQuery({
    queryKey: ['discussions', filters],
    queryFn: () => discussionsService.getAll(filters),
  });
};

export const useDiscussion = (id: string) => {
  return useQuery({
    queryKey: ['discussion', id],
    queryFn: () => discussionsService.getById(id),
    enabled: !!id,
  });
};
