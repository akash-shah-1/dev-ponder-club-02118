import { useMutation, useQueryClient } from '@tanstack/react-query';
import { votingService } from '@/api';
import { toast } from '@/hooks/use-toast';

export const useVoteQuestion = () => {
  const queryClient = useQueryClient();

  const upvote = useMutation({
    mutationFn: (questionId: string) => votingService.upvoteQuestion(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question'] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to vote. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const downvote = useMutation({
    mutationFn: (questionId: string) => votingService.downvoteQuestion(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question'] });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to vote. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return { upvote, downvote };
};

export const useVoteAnswer = () => {
  const queryClient = useQueryClient();

  const upvote = useMutation({
    mutationFn: (answerId: string) => votingService.upvoteAnswer(answerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to vote. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const downvote = useMutation({
    mutationFn: (answerId: string) => votingService.downvoteAnswer(answerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['question'] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to vote. Please try again.',
        variant: 'destructive',
      });
    },
  });

  return { upvote, downvote };
};
