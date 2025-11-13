import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Eye, CheckCircle2, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useVoting } from "@/hooks/useVoting";
import { AnswerModal } from "@/components/AnswerModal";
import { questionsService, Question } from "@/api";
import { cn } from "@/lib/utils";
import { getAvatarUrl } from "@/lib/avatar";

interface QuestionDetailDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questionId: string;
}

const mockAnswers = [
  {
    id: "1",
    body: `The best approach is to use an interceptor to handle token refresh automatically. Here's a robust solution:

\`\`\`javascript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      const { data } = await axios.post('/api/refresh', { refreshToken });
      localStorage.setItem('token', data.token);
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);
\`\`\`

This automatically retries failed requests after refreshing the token.`,
    author: {
      name: "Alex Kumar",
      avatar: "",
      reputation: 4850,
    },
    upvotes: 8,
    timestamp: "1 hour ago",
    isAccepted: false,
  },
  {
    id: "2",
    body: `I'd also recommend using \`react-query\` or \`swr\` for handling authentication state. They provide built-in retry logic and cache management.

Additionally, store tokens in httpOnly cookies instead of localStorage for better security against XSS attacks.`,
    author: {
      name: "Emma Rodriguez",
      avatar: "",
      reputation: 3120,
    },
    upvotes: 5,
    timestamp: "30 minutes ago",
    isAccepted: false,
  },
];

export const QuestionDetailDrawer = ({ open, onOpenChange, questionId }: QuestionDetailDrawerProps) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState(mockAnswers);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const questionVoting = useVoting('question');
  const answerVoting = useVoting('answer');

  useEffect(() => {
    if (open && questionId) {
      fetchQuestion();
    }
  }, [open, questionId]);

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const fetchedQuestion = await questionsService.getById(questionId);
      setQuestion(fetchedQuestion);

      // Use real answers from API if available, otherwise use mock answers
      if (fetchedQuestion.answers && fetchedQuestion.answers.length > 0) {
        setAnswers(fetchedQuestion.answers.map((answer: any) => ({
          id: answer.id,
          body: answer.content,
          author: {
            name: answer.author?.name || 'Unknown',
            avatar: answer.author?.avatar || '',
            reputation: answer.author?.reputation || 0,
          },
          upvotes: (answer.upvotes || 0) - (answer.downvotes || 0),
          timestamp: new Date(answer.createdAt).toLocaleDateString(),
          isAccepted: answer.isAccepted || false,
        })));
      } else {
        // Check localStorage for any stored answers
        const storedAnswers = localStorage.getItem(`answers_${questionId}`);
        if (storedAnswers) {
          setAnswers(JSON.parse(storedAnswers));
        } else {
          setAnswers([]);
        }
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

  const refreshAnswers = async () => {
    if (questionId) {
      try {
        const fetchedQuestion = await questionsService.getById(questionId);
        if (fetchedQuestion.answers && fetchedQuestion.answers.length > 0) {
          setAnswers(fetchedQuestion.answers.map((answer: any) => ({
            id: answer.id,
            body: answer.content,
            author: {
              name: answer.author?.name || 'Unknown',
              avatar: answer.author?.avatar || '',
              reputation: answer.author?.reputation || 0,
            },
            upvotes: (answer.upvotes || 0) - (answer.downvotes || 0),
            timestamp: new Date(answer.createdAt).toLocaleDateString(),
            isAccepted: answer.isAccepted || false,
          })));
        }
      } catch (error) {
        console.error('Error refreshing answers:', error);
      }
    }
  };

  if (loading) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <div className="p-4 text-center">
            <p className="text-muted-foreground">Loading question...</p>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  if (!question) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <div className="p-4 text-center">
            <p className="text-muted-foreground">Question not found</p>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[95vh]">
          <DrawerHeader>
            <DrawerTitle className="text-left text-base">{question.title}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 overflow-y-auto">
            {/* Question */}
            <Card className="p-4 mb-4">
              <div className="flex gap-3">
                {/* Vote column */}
                <div className="flex flex-col items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8",
                      questionVoting.getVote(question.id) === 'up' ? 'text-primary' : ''
                    )}
                    onClick={() => questionVoting.vote(question.id, 'up')}
                  >
                    <ArrowBigUp className="h-5 w-5" />
                  </Button>
                  <span className="text-base font-semibold">
                    {questionVoting.getScore(question.id, question.upvotes)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8",
                      questionVoting.getVote(question.id) === 'down' ? 'text-destructive' : ''
                    )}
                    onClick={() => questionVoting.vote(question.id, 'down')}
                  >
                    <ArrowBigDown className="h-5 w-5" />
                  </Button>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {question.views} views
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {question.answerCount || 0} answers
                    </div>
                    <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-xs overflow-x-auto">{question.description}</pre>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {question.tags.map((tag) => {
                      const tagName = typeof tag === 'string' ? tag : tag.name;
                      return (
                        <Badge key={tagName} variant="secondary" className="text-xs">
                          {tagName}
                        </Badge>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-2 pt-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={question.author.avatar || getAvatarUrl(question.author.name)} />
                      <AvatarFallback>{question.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-xs font-medium">{question.author.name}</div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="h-2.5 w-2.5" />
                        {question.author.reputation} rep
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Answers */}
            <div className="space-y-3">
              <h3 className="text-base font-bold">
                {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
              </h3>

              {answers.length === 0 ? (
                <Card className="p-4">
                  <p className="text-center text-muted-foreground text-sm">
                    No answers yet. Be the first to answer!
                  </p>
                </Card>
              ) : (
                answers.map((answer) => (
                  <Card key={answer.id} className="p-4">
                    <div className="flex gap-3">
                      {/* Vote column */}
                      <div className="flex flex-col items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-8 w-8",
                            answerVoting.getVote(answer.id) === 'up' ? 'text-primary' : ''
                          )}
                          onClick={() => answerVoting.vote(answer.id, 'up')}
                        >
                          <ArrowBigUp className="h-5 w-5" />
                        </Button>
                        <span className="text-base font-semibold">
                          {answerVoting.getScore(answer.id, answer.upvotes)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-8 w-8",
                            answerVoting.getVote(answer.id) === 'down' ? 'text-destructive' : ''
                          )}
                          onClick={() => answerVoting.vote(answer.id, 'down')}
                        >
                          <ArrowBigDown className="h-5 w-5" />
                        </Button>
                        {answer.isAccepted && (
                          <CheckCircle2 className="h-5 w-5 text-accent" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="prose max-w-none">
                          <pre className="whitespace-pre-wrap font-sans text-xs overflow-x-auto">{answer.body}</pre>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t">
                          <span className="text-xs text-muted-foreground">{answer.timestamp}</span>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={answer.author.avatar || getAvatarUrl(answer.author.name)} />
                              <AvatarFallback>{answer.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-xs font-medium">{answer.author.name}</div>
                              <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <TrendingUp className="h-2 w-2" />
                                {answer.author.reputation} rep
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>

            <Separator className="my-4" />

            {/* Your Answer */}
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Your Answer</h3>
              <p className="text-muted-foreground text-xs mb-3">
                Share your knowledge and help the community
              </p>
              <Button onClick={() => setShowAnswerModal(true)} size="sm">Write Answer</Button>
            </Card>
          </div>
        </DrawerContent>
      </Drawer>

      <AnswerModal
        open={showAnswerModal}
        onOpenChange={setShowAnswerModal}
        questionId={questionId}
        onAnswerSubmitted={refreshAnswers}
      />
    </>
  );
};
