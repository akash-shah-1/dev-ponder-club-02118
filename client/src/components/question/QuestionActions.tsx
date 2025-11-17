import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, FileText } from "lucide-react";

interface QuestionActionsProps {
  isGeneratingSummary: boolean;
  isGeneratingAi: boolean;
  onGetSummary: () => void;
  onGetAiAnswer: () => void;
  isSolved: boolean;
  hasAiAnswer: boolean;
}

export const QuestionActions = ({
  isGeneratingSummary,
  isGeneratingAi,
  onGetSummary,
  onGetAiAnswer,
  isSolved,
  hasAiAnswer,
}: QuestionActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={onGetSummary}
        disabled={isGeneratingSummary}
        variant="outline"
        size="sm"
        className="gap-2 border-blue-300 hover:bg-blue-50 dark:border-blue-700 dark:hover:bg-blue-950"
      >
        {isGeneratingSummary ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <FileText className="h-4 w-4" />
            Get Summary
          </>
        )}
      </Button>
      
      {!isSolved && !hasAiAnswer && (
        <Button
          onClick={onGetAiAnswer}
          disabled={isGeneratingAi}
          variant="outline"
          size="sm"
          className="gap-2 border-purple-300 hover:bg-purple-50 dark:border-purple-700 dark:hover:bg-purple-950"
        >
          {isGeneratingAi ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Get AI Answer
            </>
          )}
        </Button>
      )}
    </div>
  );
};
