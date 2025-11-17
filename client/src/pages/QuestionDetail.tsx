import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { AnswerModal } from "@/components/AnswerModal";
import { AiAnswerCard } from "@/components/AiAnswerCard";
import { SummaryDisplay } from "@/components/SummaryDisplay";
import { useQuestionDetail } from "@/hooks/useQuestionDetail";
import { QuestionHeader } from "@/components/question/QuestionHeader";
import { QuestionBody } from "@/components/question/QuestionBody";
import { QuestionActions } from "@/components/question/QuestionActions";
import { AnswerList } from "@/components/question/AnswerList";
import { YourAnswer } from "@/components/question/YourAnswer";
import { VoteColumn } from "@/components/VoteColumn";
import { useState } from "react";
import { useVoteQuestion } from "@/hooks/useVote";

const QuestionDetail = () => {
  const navigate = useNavigate();
  const {
    id,
    question,
    loading,
    aiAnswer,
    isGeneratingAi,
    summary,
    isGeneratingSummary,
    showSummaryModal,
    setShowSummaryModal,
    refreshAnswers,
    handleMarkSolved,
    handleGetAiAnswer,
    handleGetSummary,
  } = useQuestionDetail();

  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const questionVote = useVoteQuestion();
  const [questionVoteState, setQuestionVoteState] = useState<'up' | 'down' | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-0">
        <Navigation />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6">
            <div className="max-w-5xl mx-auto space-y-6">
              <Skeleton className="h-10 w-24" />
              <Card className="p-4 md:p-6">
                <div className="flex gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-32 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-0">
        <Navigation />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6">
            <div className="max-w-5xl mx-auto text-center py-12">
              <p className="text-muted-foreground">Question not found</p>
              <Button onClick={() => navigate('/questions')} className="mt-4">
                Back to Questions
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-0">
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <Card className="p-4 md:p-6">
              <div className="flex gap-3 md:gap-6">
                <VoteColumn
                  itemId={question.id}
                  initialScore={question.upvotes - question.downvotes}
                  currentVote={questionVoteState}
                  onUpvote={() => {
                    questionVote.upvote.mutate(question.id);
                    setQuestionVoteState(questionVoteState === 'up' ? null : 'up');
                  }}
                  onDownvote={() => {
                    questionVote.downvote.mutate(question.id);
                    setQuestionVoteState(questionVoteState === 'down' ? null : 'down');
                  }}
                />
                <div className="flex-1 space-y-3 md:space-y-4 min-w-0">
                    <QuestionHeader question={question} onMarkSolved={handleMarkSolved} />
                    <QuestionBody description={question.description} tags={question.tags} author={question.author}/>
                </div>
              </div>
            </Card>

            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-lg md:text-xl font-bold">
                  {question.answers?.length || 0} {question.answers?.length === 1 ? 'Answer' : 'Answers'}
                </h2>
                <QuestionActions
                  isGeneratingSummary={isGeneratingSummary}
                  isGeneratingAi={isGeneratingAi}
                  onGetSummary={handleGetSummary}
                  onGetAiAnswer={handleGetAiAnswer}
                  isSolved={question.solved}
                  hasAiAnswer={!!aiAnswer}
                />
              </div>

              {aiAnswer && (
                <div className="max-h-[600px]">
                  <AiAnswerCard
                    answer={aiAnswer.answer}
                    generatedAt={aiAnswer.generatedAt}
                    model={aiAnswer.model}
                    images={aiAnswer.images}
                  />
                </div>
              )}

              <AnswerList answers={question.answers || []} />
            </div>

            {!question.solved && (
              <>
                <Separator />
                <YourAnswer onWriteAnswer={() => setShowAnswerModal(true)} />
              </>
            )}
          </div>
        </main>
      </div>

      <AnswerModal
        open={showAnswerModal}
        onOpenChange={setShowAnswerModal}
        questionId={id || ''}
        onAnswerSubmitted={refreshAnswers}
      />
      
      {summary && (
        <SummaryDisplay
            open={showSummaryModal}
            onOpenChange={setShowSummaryModal}
            summary={summary.summary}
            generatedAt={new Date().toISOString()}
        />
      )}
      
      <MobileNav />
    </div>
  );
};

export default QuestionDetail;
