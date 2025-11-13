import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/api';

export const useAnalytics = () => {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsService.getOverallAnalytics,
  });
};

export const useUserStats = (userId: string) => {
  return useQuery({
    queryKey: ['userStats', userId],
    queryFn: () => analyticsService.getUserStats(userId),
    enabled: !!userId,
  });
};
