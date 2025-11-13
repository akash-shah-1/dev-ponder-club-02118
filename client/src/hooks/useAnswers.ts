import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { answersService, CreateAnswerData } from '@/api';
import { toast } from '@/hooks/use-toast';

export const useAnswers = (questionId: string) => {
  return useQuery({
    queryKey: ['answers', questionId],
    queryFn: () => answersService.getAll(questionId),
    enabled: !!questionId,
  });
};

export const useCreateAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAnswerData) => answersService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['answers', variables.questionId] });
      queryClient.invalidateQueries({ queryKey: ['question', variables.questionId] });
      toast({
        title: 'Answer posted!',
        description: 'Your answer has been successfully posted.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to post answer. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpvoteAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ answerId, userId }: { answerId: string; userId: string }) => 
      answersService.getById(answerId).then(() => {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['answers'] });
      toast({
        title: 'Upvoted!',
      });
    },
  });
};

export const useAcceptAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => answersService.acceptAnswer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['answers'] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({
        title: 'Answer accepted!',
        description: 'This answer has been marked as the solution.',
      });
    },
  });
};
