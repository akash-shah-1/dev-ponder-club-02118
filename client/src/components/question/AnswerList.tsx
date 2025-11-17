import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VoteColumn } from "@/components/VoteColumn";
import { AuthorInfo } from "@/components/AuthorInfo";
import { Answer } from "@/api";
import { useVoteAnswer } from "@/hooks/useVote";
import { useState } from "react";

interface AnswerListProps {
  answers: Answer[];
}

const AnswerItem = ({ answer, isTopAnswer }: { answer: Answer, isTopAnswer: boolean }) => {
    const answerVote = useVoteAnswer();
    const [voteState, setVoteState] = useState<'up' | 'down' | null>(null);

    return (
        <Card 
            key={answer.id} 
            className={`p-4 md:p-6 ${isTopAnswer ? 'border-2 border-amber-400 bg-amber-50/50 dark:bg-amber-950/20 shadow-lg' : ''}`}
        >
            {isTopAnswer && (
                <div className="mb-3 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                    🏆 Top Answer
                </Badge>
                </div>
            )}
            <div className="flex gap-3 md:gap-6">
                <VoteColumn
                    itemId={answer.id}
                    initialScore={(answer.upvotes || 0) - (answer.downvotes || 0)}
                    currentVote={voteState}
                    onUpvote={() => {
                        answerVote.upvote.mutate(answer.id);
                        setVoteState(voteState === 'up' ? null : 'up');
                    }}
                    onDownvote={() => {
                        answerVote.downvote.mutate(answer.id);
                        setVoteState(voteState === 'down' ? null : 'down');
                    }}
                    isAccepted={answer.isAccepted || false}
                />

                <div className="flex-1 space-y-3 md:space-y-4 min-w-0">
                    <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-xs md:text-sm overflow-x-auto">{answer.content}</pre>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 md:pt-4 border-t gap-2">
                        <span className="text-xs md:text-sm text-muted-foreground">
                        {new Date(answer.createdAt).toLocaleDateString()}
                        </span>
                        <AuthorInfo
                            name={answer.author?.name || 'Unknown'}
                            avatar={answer.author?.avatar}
                            reputation={answer.author?.reputation || 0}
                            avatarSize="md"
                        />
                    </div>
                </div>
            </div>
        </Card>
    )
}

export const AnswerList = ({ answers }: AnswerListProps) => {
  if (!answers || answers.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">
          No answers yet. Be the first to answer!
        </p>
      </Card>
    );
  }

  const maxUpvotes = Math.max(...answers.map((a: any) => (a.upvotes || 0) - (a.downvotes || 0)));

  return (
    <div className="space-y-4">
      {answers.map((answer) => {
        const score = (answer.upvotes || 0) - (answer.downvotes || 0);
        const isTopAnswer = score === maxUpvotes && score > 0 && answers.length > 1;
        return <AnswerItem key={answer.id} answer={answer} isTopAnswer={isTopAnswer}/>
      })}
    </div>
  );
};
