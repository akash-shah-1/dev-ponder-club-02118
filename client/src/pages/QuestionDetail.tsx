import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare, Eye, ArrowLeft, CheckCircle2, Sparkles, Loader2, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useVoteQuestion, useVoteAnswer } from "@/hooks/useVote";
import { AnswerModal } from "@/components/AnswerModal";
import { questionsService, Question } from "@/api";
import { VoteColumn } from "@/components/VoteColumn";
import { AuthorInfo } from "@/components/AuthorInfo";
import { useCurrentUser } from "@/hooks/useUser";
import { aiService } from "@/api/services/ai.service";
import { AiAnswerCard } from "@/components/AiAnswerCard";
import { SummaryModal } from "@/components/SummaryModal";
import * as party from "party-js";

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUser();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const questionVote = useVoteQuestion();
  const answerVote = useVoteAnswer();
  const [questionVoteState, setQuestionVoteState] = useState<'up' | 'down' | null>(null);
  const [answerVoteStates, setAnswerVoteStates] = useState<Record<string, 'up' | 'down' | null>>({});
  const [aiAnswer, setAiAnswer] = useState<any>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const fetchedQuestion = await questionsService.getById(id);
        setQuestion(fetchedQuestion);
        
        // Check if AI answer already exists
        const existingAiAnswer = await aiService.getAiAnswer(id);
        if (existingAiAnswer) {
          setAiAnswer(existingAiAnswer);
        }
      } catch (error) {
        console.error('Error fetching question:', error);
        toast({
          title: "Error",
          description: "Failed to load question details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  const refreshAnswers = async () => {
    if (!id) return;

    try {
      const fetchedQuestion = await questionsService.getById(id);
      setQuestion(fetchedQuestion);
    } catch (error) {
      console.error('Error refreshing answers:', error);
    }
  };

  const handleMarkSolved = async () => {
    if (!id || !question) return;

    try {
      await questionsService.markAsSolved(id);
      setQuestion({ ...question, solved: true });

      // Trigger confetti celebration
      party.confetti(document.body, {
        count: party.variation.range(80, 120),
        spread: party.variation.range(50, 80),
      });

      toast({
        title: "Question resolved!",
        description: "Great job solving this question!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark question as solved",
        variant: "destructive",
      });
    }
  };

  const handleGetAiAnswer = async () => {
    if (!question || !id) return;

    setIsGeneratingAi(true);
    try {
      const response = await aiService.answerQuestion(
        id,
        question.title,
        question.description
      );
      
      setAiAnswer(response);
      
      toast({
        title: "AI Answer Generated!",
        description: "Scroll down to see the detailed AI-generated answer with examples.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleGetSummary = async () => {
    if (!question || !id) return;

    setIsGeneratingSummary(true);
    try {
      const response = await aiService.generateSummary(
        id,
        question.title,
        question.description,
        question.answers || []
      );
      
      setSummary(response);
      setShowSummaryModal(true);
      
      toast({
        title: "Summary Generated!",
        description: "View the AI-generated summary of this discussion.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

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
            {/* Back Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            {/* Question */}
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
                  <div className="flex items-start justify-between gap-4">
                    <h1 className="text-lg md:text-2xl font-bold break-words flex-1">{question.title}</h1>
                    {!question.solved && currentUser && question.authorId === currentUser.id && (
                      <Button
                        onClick={handleMarkSolved}
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

                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-xs md:text-sm overflow-x-auto">{question.description}</pre>
                  </div>

                  <div className="flex flex-wrap gap-1.5 md:gap-2">
                    {question.tags.map((tag) => {
                      const tagName = typeof tag === 'string' ? tag : tag.name;
                      return (
                        <Badge key={tagName} variant="secondary" className="text-xs">
                          {tagName}
                        </Badge>
                      );
                    })}
                  </div>

                  <div className="pt-3 md:pt-4">
                    <AuthorInfo
                      name={question.author.name}
                      avatar={question.author.avatar}
                      reputation={question.author.reputation}
                      avatarSize="lg"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Answers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-lg md:text-xl font-bold">
                  {question.answers?.length || 0} {question.answers?.length === 1 ? 'Answer' : 'Answers'}
                </h2>
                <div className="flex gap-2">
                  {/* Get Summary Button */}
                  <Button
                    onClick={handleGetSummary}
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
                  
                  {/* Only show AI Answer button if question is not solved and no AI answer exists */}
                  {!question.solved && !aiAnswer && (
                    <Button
                      onClick={handleGetAiAnswer}
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
              </div>

              {/* AI Generated Answer - Always show if exists */}
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

              {question.answers && question.answers.length > 0 ? (
                (() => {
                  // Find answer with max upvotes
                  const maxUpvotes = Math.max(...question.answers.map((a: any) => (a.upvotes || 0) - (a.downvotes || 0)));
                  
                  return question.answers.map((answer: any) => {
                    const score = (answer.upvotes || 0) - (answer.downvotes || 0);
                    const isTopAnswer = score === maxUpvotes && score > 0 && question.answers.length > 1;
                    
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
                        currentVote={answerVoteStates[answer.id] || null}
                        onUpvote={() => {
                          answerVote.upvote.mutate(answer.id);
                          setAnswerVoteStates(prev => ({
                            ...prev,
                            [answer.id]: prev[answer.id] === 'up' ? null : 'up'
                          }));
                        }}
                        onDownvote={() => {
                          answerVote.downvote.mutate(answer.id);
                          setAnswerVoteStates(prev => ({
                            ...prev,
                            [answer.id]: prev[answer.id] === 'down' ? null : 'down'
                          }));
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
                  );
                })})()
              ) : (
                <Card className="p-6">
                  <p className="text-center text-muted-foreground">
                    No answers yet. Be the first to answer!
                  </p>
                </Card>
              )}
            </div>

            {/* Only show separator and Your Answer section if question is not solved */}
            {!question.solved && (
              <>
                <Separator />

                {/* Your Answer */}
                <Card className="p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Your Answer</h3>
                  <p className="text-muted-foreground text-xs md:text-sm mb-3 md:mb-4">
                    Share your knowledge and help the community
                  </p>
                  <Button onClick={() => setShowAnswerModal(true)} size="sm">Write Answer</Button>
                </Card>
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
      
      {/* Summary Modal */}
      {summary && (
        <SummaryModal
          open={showSummaryModal}
          onOpenChange={setShowSummaryModal}
          summary={summary.summary}
          generatedAt={summary.generatedAt}
        />
      )}
      
      <MobileNav />
    </div>
  );
};

export default QuestionDetail;
