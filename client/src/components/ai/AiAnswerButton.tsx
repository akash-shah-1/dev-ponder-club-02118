import { useState, useEffect } from 'react';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { aiService } from '@/services/ai.service';
import { useAuth } from '@clerk/clerk-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AiAnswerButtonProps {
  questionId: string;
  onAnswerGenerated?: () => void;
}

export function AiAnswerButton({ questionId, onAnswerGenerated }: AiAnswerButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasAiAnswer, setHasAiAnswer] = useState(false);
  const { isSignedIn } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    checkExistingAnswer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  const checkExistingAnswer = async () => {
    try {
      const result = await aiService.checkExistingAiAnswer(questionId);
      setHasAiAnswer(result.exists);
    } catch (error) {
      console.error('Error checking AI answer:', error);
    }
  };

  const handleGenerateAnswer = async () => {
    if (!isSignedIn) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to generate AI answers',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      await aiService.generateAnswer(questionId);
      
      toast({
        title: 'AI Answer Generated',
        description: 'The AI has provided an answer to this question',
      });

      setHasAiAnswer(true);
      onAnswerGenerated?.();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to generate AI answer';
      
      toast({
        title: 'Generation Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (hasAiAnswer) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" disabled className="gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              AI Answer Generated
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>An AI answer already exists for this question</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleGenerateAnswer}
            disabled={isGenerating || !isSignedIn}
            variant="outline"
            className="gap-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-purple-600" />
                Generate AI Answer
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isSignedIn ? 'Get an AI-generated answer' : 'Sign in to use AI'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
