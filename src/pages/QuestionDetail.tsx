import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowBigUp, ArrowBigDown, MessageSquare, Eye, CheckCircle2, TrendingUp, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useVoting } from "@/hooks/useVoting";
import { AnswerModal } from "@/components/AnswerModal";
import { questionsService, Question } from "@/api";
import { cn } from "@/lib/utils";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-0">
        <Navigation />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6">
            <div className="max-w-5xl mx-auto text-center py-12">
              <p className="text-muted-foreground">Loading question...</p>
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
                {/* Vote column */}
                <div className="flex flex-col items-center gap-1.5 md:gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={cn(
                      "h-8 w-8 md:h-10 md:w-10",
                      questionVoting.getVote(question.id) === 'up' ? 'text-primary' : ''
                    )}
                    onClick={() => questionVoting.vote(question.id, 'up')}
                  >
                    <ArrowBigUp className="h-5 w-5 md:h-6 md:w-6" />
                  </Button>
                  <span className="text-base md:text-lg font-semibold">
                    {questionVoting.getScore(question.id, question.upvotes)}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className={cn(
                      "h-8 w-8 md:h-10 md:w-10",
                      questionVoting.getVote(question.id) === 'down' ? 'text-destructive' : ''
                    )}
                    onClick={() => questionVoting.vote(question.id, 'down')}
                  >
                    <ArrowBigDown className="h-5 w-5 md:h-6 md:w-6" />
                  </Button>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3 md:space-y-4 min-w-0">
                  <h1 className="text-lg md:text-2xl font-bold break-words">{question.title}</h1>
                  
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

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 md:pt-4 gap-2">
                    <div className="flex items-center gap-2 md:gap-3">
                      <Avatar className="h-8 w-8 md:h-10 md:w-10">
                        <AvatarImage src={question.author.avatar} />
                        <AvatarFallback>{question.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-xs md:text-sm font-medium">{question.author.name}</div>
                        <div className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1">
                          <TrendingUp className="h-2.5 w-2.5 md:h-3 md:w-3" />
                          {question.author.reputation} rep
                        </div>
                      </div>
                    </div>
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
                    {/* Vote column */}
                    <div className="flex flex-col items-center gap-1.5 md:gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className={cn(
                          "h-8 w-8 md:h-10 md:w-10",
                          answerVoting.getVote(answer.id) === 'up' ? 'text-primary' : ''
                        )}
                        onClick={() => answerVoting.vote(answer.id, 'up')}
                      >
                        <ArrowBigUp className="h-5 w-5 md:h-6 md:w-6" />
                      </Button>
                      <span className="text-base md:text-lg font-semibold">
                        {answerVoting.getScore(answer.id, answer.upvotes)}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className={cn(
                          "h-8 w-8 md:h-10 md:w-10",
                          answerVoting.getVote(answer.id) === 'down' ? 'text-destructive' : ''
                        )}
                        onClick={() => answerVoting.vote(answer.id, 'down')}
                      >
                        <ArrowBigDown className="h-5 w-5 md:h-6 md:w-6" />
                      </Button>
                      {answer.isAccepted && (
                        <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-accent" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3 md:space-y-4 min-w-0">
                      <div className="prose max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-xs md:text-sm overflow-x-auto">{answer.body}</pre>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 md:pt-4 border-t gap-2">
                        <span className="text-xs md:text-sm text-muted-foreground">{answer.timestamp}</span>
                        <div className="flex items-center gap-2 md:gap-3">
                          <Avatar className="h-7 w-7 md:h-8 md:w-8">
                            <AvatarImage src={answer.author.avatar} />
                            <AvatarFallback>{answer.author.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-xs md:text-sm font-medium">{answer.author.name}</div>
                            <div className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1">
                              <TrendingUp className="h-2.5 w-2.5 md:h-3 md:w-3" />
                              {answer.author.reputation} rep
                            </div>
                          </div>
                        </div>
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
