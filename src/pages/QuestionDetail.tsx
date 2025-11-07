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
import { MessageSquare, Eye, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useVoting } from "@/hooks/useVoting";
import { AnswerModal } from "@/components/AnswerModal";
import { questionsService, Question } from "@/api";
import { VoteColumn } from "@/components/VoteColumn";
import { AuthorInfo } from "@/components/AuthorInfo";
import * as party from "party-js";

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

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState(mockAnswers);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const questionVoting = useVoting('question');
  const answerVoting = useVoting('answer');

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const fetchedQuestion = await questionsService.getById(id);
        setQuestion(fetchedQuestion);
        
        const storedAnswers = localStorage.getItem(`answers_${id}`);
        if (storedAnswers) {
          setAnswers(JSON.parse(storedAnswers));
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

  const refreshAnswers = () => {
    if (id) {
      const storedAnswers = localStorage.getItem(`answers_${id}`);
      if (storedAnswers) {
        setAnswers(JSON.parse(storedAnswers));
      }
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
                  initialScore={questionVoting.getScore(question.id, question.upvotes)}
                  currentVote={questionVoting.getVote(question.id)}
                  onUpvote={() => questionVoting.vote(question.id, 'up')}
                  onDownvote={() => questionVoting.vote(question.id, 'down')}
                />

                <div className="flex-1 space-y-3 md:space-y-4 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <h1 className="text-lg md:text-2xl font-bold break-words flex-1">{question.title}</h1>
                    {!question.solved && (
                      <Button 
                        onClick={handleMarkSolved}
                        variant="outline"
                        size="sm"
                        className="gap-2 shrink-0"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Mark Solved
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
                    {question.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
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
              <h2 className="text-lg md:text-xl font-bold">{answers.length} Answers</h2>

              {answers.map((answer) => (
                <Card key={answer.id} className="p-4 md:p-6">
                  <div className="flex gap-3 md:gap-6">
                    <VoteColumn
                      itemId={answer.id}
                      initialScore={answerVoting.getScore(answer.id, answer.upvotes)}
                      currentVote={answerVoting.getVote(answer.id)}
                      onUpvote={() => answerVoting.vote(answer.id, 'up')}
                      onDownvote={() => answerVoting.vote(answer.id, 'down')}
                      isAccepted={answer.isAccepted}
                    />

                    <div className="flex-1 space-y-3 md:space-y-4 min-w-0">
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-xs md:text-sm overflow-x-auto">{answer.body}</pre>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 md:pt-4 border-t gap-2">
                        <span className="text-xs md:text-sm text-muted-foreground">{answer.timestamp}</span>
                        <AuthorInfo
                          name={answer.author.name}
                          avatar={answer.author.avatar}
                          reputation={answer.author.reputation}
                          avatarSize="md"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Separator />

            {/* Your Answer */}
            <Card className="p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Your Answer</h3>
              <p className="text-muted-foreground text-xs md:text-sm mb-3 md:mb-4">
                Share your knowledge and help the community
              </p>
              <Button onClick={() => setShowAnswerModal(true)} size="sm">Write Answer</Button>
            </Card>
          </div>
        </main>
      </div>
      
      <AnswerModal 
        open={showAnswerModal}
        onOpenChange={setShowAnswerModal}
        questionId={id || ''}
        onAnswerSubmitted={refreshAnswers}
      />
      <MobileNav />
    </div>
  );
};

export default QuestionDetail;
