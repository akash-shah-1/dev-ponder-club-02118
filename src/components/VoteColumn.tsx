import { ArrowBigUp, ArrowBigDown, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoteColumnProps {
  itemId: string;
  initialScore: number;
  currentVote: 'up' | 'down' | null;
  onUpvote: () => void;
  onDownvote: () => void;
  isAccepted?: boolean;
  className?: string;
}

export const VoteColumn = ({
  itemId,
  initialScore,
  currentVote,
  onUpvote,
  onDownvote,
  isAccepted = false,
  className,
}: VoteColumnProps) => {
  return (
    <div className={cn("flex flex-col items-center gap-1.5 md:gap-2", className)}>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 md:h-10 md:w-10 transition-colors",
          currentVote === 'up' && "text-primary"
        )}
        onClick={onUpvote}
      >
        <ArrowBigUp className="h-5 w-5 md:h-6 md:w-6" />
      </Button>
      
      <span className="text-base md:text-lg font-semibold">
        {initialScore}
      </span>
      
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 md:h-10 md:w-10 transition-colors",
          currentVote === 'down' && "text-destructive"
        )}
        onClick={onDownvote}
      >
        <ArrowBigDown className="h-5 w-5 md:h-6 md:w-6" />
      </Button>
      
      {isAccepted && (
        <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-accent mt-1" />
      )}
    </div>
  );
};
