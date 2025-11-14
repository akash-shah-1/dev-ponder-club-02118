import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Eye, CheckCircle2, TrendingUp, Sparkles, Loader2, FileText, Volume2, VolumeX, Bot } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useVoting } from "@/hooks/useVoting";
import { AnswerModal } from "@/components/AnswerModal";
import { questionsService, Question } from "@/api";
import { cn } from "@/lib/utils";
import { getAvatarUrl } from "@/lib/avatar";
import { aiService } from "@/api/services/ai.service";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

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
  const [aiAnswer, setAiAnswer] = useState<any>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (open && questionId) {
      fetchQuestion();
    }
    
    // Cleanup speech synthesis when drawer closes
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    };
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
      
      // Check if AI answer already exists
      try {
        const existingAiAnswer = await aiService.getAiAnswer(questionId);
        if (existingAiAnswer) {
          setAiAnswer(existingAiAnswer);
        }
      } catch (error) {
        // AI answer doesn't exist, that's fine
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

  const handleGetAiAnswer = async () => {
    if (!question || !questionId) return;

    setIsGeneratingAi(true);
    try {
      const response = await aiService.answerQuestion(
        questionId,
        question.title,
        question.description
      );
      
      setAiAnswer(response);
      
      toast({
        title: "AI Answer Generated!",
        description: "Scroll down to see the detailed AI-generated answer.",
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
    if (!question || !questionId) return;

    setIsGeneratingSummary(true);
    try {
      const response = await aiService.generateSummary(
        questionId,
        question.title,
        question.description,
        answers.map(a => ({ content: a.body, author: a.author }))
      );
      
      toast({
        title: "Summary Generated!",
        description: response.summary.substring(0, 100) + "...",
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

  const toggleVoiceMode = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      speakAnswer();
    }
  };

  const speakAnswer = () => {
    if (!question) return;

    // Find the best answer to speak
    let textToSpeak = "";
    
    if (aiAnswer) {
      textToSpeak = `AI Generated Answer: ${aiAnswer.answer}`;
    } else if (answers.length > 0) {
      // Find accepted answer or highest voted answer
      const acceptedAnswer = answers.find(a => a.isAccepted);
      const topAnswer = acceptedAnswer || answers.reduce((prev, current) => 
        (current.upvotes > prev.upvotes) ? current : prev
      );
      textToSpeak = `Top Answer: ${topAnswer.body}`;
    } else {
      textToSpeak = "No answers available yet for this question.";
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast({
        title: "Voice Error",
        description: "Failed to play voice. Please try again.",
        variant: "destructive",
      });
    };

    window.speechSynthesis.speak(utterance);
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

            {/* AI Buttons */}
            <div className="flex gap-2 flex-wrap">
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
                    Summary
                  </>
                )}
              </Button>
              
              {!question?.solved && !aiAnswer && (
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
                      AI Answer
                    </>
                  )}
                </Button>
              )}

              {question?.solved && (answers.length > 0 || aiAnswer) && (
                <Button
                  onClick={toggleVoiceMode}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "gap-2",
                    isSpeaking 
                      ? "border-green-500 bg-green-50 dark:bg-green-950/20" 
                      : "border-gray-300"
                  )}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="h-4 w-4" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Volume2 className="h-4 w-4" />
                      Voice
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Answers */}
            <div className="space-y-3">
              <h3 className="text-base font-bold">
                {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
              </h3>

              {/* AI Answer */}
              {aiAnswer && (
                <Card className="p-4 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 border-2 border-purple-200 dark:border-purple-800">
                  <div className="flex items-start gap-2 mb-3">
                    <div className="p-1.5 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm">AI Generated Answer</h4>
                        <Badge variant="secondary" className="gap-1 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 text-[10px]">
                          <Sparkles className="h-2.5 w-2.5" />
                          {aiAnswer.model}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Generated {new Date(aiAnswer.generatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="prose max-w-none text-xs">
                    <MarkdownRenderer content={aiAnswer.answer} />
                  </div>

                  <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-800">
                    <p className="text-[10px] text-muted-foreground italic">
                      💡 This answer was generated by AI. Please verify the solution.
                    </p>
                  </div>
                </Card>
              )}

              {answers.length === 0 && !aiAnswer ? (
                <Card className="p-4">
                  <p className="text-center text-muted-foreground text-sm">
                    No answers yet. Be the first to answer!
                  </p>
                </Card>
              ) : (
                (() => {
                  // Find answer with max upvotes
                  const maxUpvotes = Math.max(...answers.map(a => a.upvotes));
                  
                  return answers.map((answer) => {
                    const isTopAnswer = answer.upvotes === maxUpvotes && maxUpvotes > 0 && answers.length > 1;
                    
                    return (
                      <Card 
                        key={answer.id} 
                        className={cn(
                          "p-4",
                          isTopAnswer && "border-2 border-amber-400 bg-amber-50/50 dark:bg-amber-950/20"
                        )}
                      >
                        {isTopAnswer && (
                          <div className="mb-2 flex items-center gap-2">
                            <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 text-[10px]">
                              🏆 Top Answer
                            </Badge>
                          </div>
                        )}
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
                    );
                  })
                })()
              )}
            </div>

            {/* Only show Your Answer section if question is not solved */}
            {!question?.solved && (
              <>
                <Separator className="my-4" />

                <Card className="p-4">
                  <h3 className="text-sm font-semibold mb-3">Your Answer</h3>
                  <p className="text-muted-foreground text-xs mb-3">
                    Share your knowledge and help the community
                  </p>
                  <Button onClick={() => setShowAnswerModal(true)} size="sm">Write Answer</Button>
                </Card>
              </>
            )}
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
