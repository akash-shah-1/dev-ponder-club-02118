import { useQuery } from '@tanstack/react-query';
import { userService } from '@/api/services/user.service';

export const useUserStats = () => {
  return useQuery({
    queryKey: ['user', 'stats'],
    queryFn: () => userService.getCurrentUserStats(),
  });
};

export const useUserActivity = () => {
  return useQuery({
    queryKey: ['user', 'activity'],
    queryFn: () => userService.getCurrentUserActivity(),
  });
};
