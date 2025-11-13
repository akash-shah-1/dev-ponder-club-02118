import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionsService, CreateQuestionData } from '@/api';
import { toast } from '@/hooks/use-toast';

export const useQuestions = () => {
  return useQuery({
    queryKey: ['questions'],
    queryFn: () => questionsService.getAll(),
  });
};

export const useQuestion = (id: string) => {
  return useQuery({
    queryKey: ['question', id],
    queryFn: () => questionsService.getById(id),
    enabled: !!id,
  });
};

export const useQuestionsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['questions', 'category', category],
    queryFn: () => questionsService.getByCategory(category),
    enabled: !!category,
  });
};

export const useSearchQuestions = (query: string) => {
  return useQuery({
    queryKey: ['questions', 'search', query],
    queryFn: () => questionsService.searchQuestions(query),
    enabled: query.length > 2,
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateQuestionData) => questionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({
        title: 'Question posted!',
        description: 'Your question has been successfully posted.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to post question. Please try again.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpvoteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => questionsService.upvoteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({
        title: 'Upvoted!',
      });
    },
  });
};

export const useMarkAsSolved = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => questionsService.markAsSolved(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({
        title: 'Marked as solved!',
      });
    },
  });
};
