import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Eye, MessageSquare } from "lucide-react";
import { useCurrentUser } from "@/hooks/useUser";

interface QuestionHeaderProps {
  question: {
    id: string;
    title: string;
    solved: boolean;
    authorId: string;
    views: number;
    answerCount: number;
    createdAt: string;
  };
  onMarkSolved: () => void;
}

export const QuestionHeader = ({ question, onMarkSolved }: QuestionHeaderProps) => {
  const { data: currentUser } = useCurrentUser();

  return (
    <div className="flex-1 space-y-3 md:space-y-4 min-w-0">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-lg md:text-2xl font-bold break-words flex-1">{question.title}</h1>
        {!question.solved && currentUser && question.authorId === currentUser.id && (
          <Button
            onClick={onMarkSolved}
            variant="outline"
            size="sm"
            className="gap-2 shrink-0"
          >
            <CheckCircle2 className="h-4 w-4" />
            Resolve
          </Button>
        )}
        {question.solved && (
          <Badge variant="default" className="gap-1 shrink-0">
            <CheckCircle2 className="h-4 w-4" />
            Solved
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3 md:h-4 md:w-4" />
          {question.views} views
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3 md:h-4 md:w-4" />
          {question.answerCount || 0} answers
        </div>
        <span>{new Date(question.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};
