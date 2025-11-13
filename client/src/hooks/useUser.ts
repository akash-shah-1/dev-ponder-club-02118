import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersService, User } from '@/api';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@clerk/clerk-react';

export const useCurrentUser = () => {
  const { isSignedIn } = useUser();
  
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: usersService.getCurrentUser,
    enabled: isSignedIn,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersService.getById(id),
    enabled: !!id,
  });
};

export const useTopHelpers = (limit?: number) => {
  return useQuery({
    queryKey: ['topHelpers', limit],
    queryFn: () => usersService.getTopHelpers(limit),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: Partial<User> }) => 
      usersService.updateProfile(userId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast({
        title: 'Profile updated!',
        description: 'Your profile has been successfully updated.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    },
  });
};
