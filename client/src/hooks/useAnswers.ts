import { useMutation, useQueryClient } from '@tanstack/react-query';
import { answersService } from '@/api';
import { toast } from '@/hooks/use-toast';

export interface CreateAnswerData {
  content: string;
  questionId: string;
}

export const useCreateAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAnswerData) => answersService.create(data),
    onSuccess: (_, variables) => {
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

export const useAcceptAnswer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (answerId: string) => answersService.acceptAnswer(answerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question'] });
      toast({
        title: 'Answer accepted!',
        description: 'This answer has been marked as the solution.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to accept answer.',
        variant: 'destructive',
      });
    },
  });
};
