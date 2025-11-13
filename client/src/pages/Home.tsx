import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from "@/hooks/useUser";
import { useQuestions } from "@/hooks/useQuestions";
import { MessageSquare, Eye, ThumbsUp, Sparkles, TrendingUp } from "lucide-react";
import { AskQuestionModal } from "@/components/AskQuestionModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { QuestionDetailDrawer } from "@/components/QuestionDetailDrawer";

const Home = () => {
  const { data: currentUser } = useCurrentUser();
  const { data: questions, isLoading } = useQuestions();
  const [showAskModal, setShowAskModal] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const questionOfDay = questions?.[0];
  const interestingPosts = questions?.slice(1, 4) || [];

  const handleQuestionClick = (questionId: string) => {
    if (isMobile) {
      setSelectedQuestionId(questionId);
    } else {
      navigate(`/questions/${questionId}`);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20 md:pb-0">
      <Navigation />
      
      <div className="flex">
        {/* Left Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 p-4 mx-auto md:p-6 max-w-5xl">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-4">
              <div className="bg-primary/10 p-2 md:p-3 rounded-lg">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-bold text-foreground">
                  Welcome to Stack Overflow, {currentUser?.name || "Guest"}!
                </h1>
                <p className="text-muted-foreground text-xs md:text-sm mt-1">
                  Find answers to your technical questions and help others answer theirs.
                </p>
              </div>
              {!isMobile && (
                <Button onClick={() => setShowAskModal(true)} className="ml-auto" size="sm">
                  Ask Question
                </Button>
              )}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 mt-4 md:mt-6">
              {/* Reputation Card */}
              <Card className="border-border">
                <CardContent className="p-3 md:p-4">
                  <h3 className="text-xs md:text-sm font-semibold text-foreground mb-2">Reputation</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-3xl font-bold text-foreground">{currentUser?.reputation || 1}</span>
                    <div className="flex-1 h-1.5 md:h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[15%]"></div>
                    </div>
                  </div>
                  <p className="text-[10px] md:text-xs text-muted-foreground mt-2">
                    Earn reputation by{" "}
                    <Link to="/ask" className="text-primary hover:underline">Asking</Link>,{" "}
                    <Link to="/questions" className="text-primary hover:underline">Answering</Link> and{" "}
                    <span className="text-primary">Editing</span>
                  </p>
                </CardContent>
              </Card>

              {/* Badge Progress Card */}
              <Card className="border-border">
                <CardContent className="p-3 md:p-4">
                  <h3 className="text-xs md:text-sm font-semibold text-foreground mb-2">Badge progress</h3>
                  <p className="text-[10px] md:text-sm text-muted-foreground mb-3">
                    Take the tour to earn your first badge!
                  </p>
                  <Button variant="default" size="sm" className="text-xs" onClick={() => navigate("/questions")}>Get started here</Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Question of the Day */}
          {questionOfDay && (
            <Card className="mb-4 md:mb-6 border-0 bg-gradient-to-br from-primary/10 via-tertiary/10 to-accent/10 shadow-lg overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl -z-0" />
              <CardContent className="p-5 md:p-7 relative z-10">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-tertiary shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-base md:text-lg font-bold text-foreground">Question of the Day</h2>
                      <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30 text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Hot
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">Earn bonus reputation for answering!</p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <h3 className="text-sm md:text-base font-semibold text-foreground mb-3 line-clamp-2 leading-relaxed">
                      {questionOfDay.title}
                    </h3>
                    <div className="flex gap-1.5 md:gap-2 mb-4 flex-wrap">
                      {questionOfDay.tags.slice(0, 3).map((tag) => {
                        const tagName = typeof tag === 'string' ? tag : tag.name;
                        return (
                          <Badge key={tagName} variant="secondary" className="bg-background/80 backdrop-blur-sm text-foreground border-border text-xs">
                            {tagName}
                          </Badge>
                        );
                      })}
                    </div>
                    <Button 
                      size="sm" 
                      className="text-xs md:text-sm bg-gradient-to-r from-primary to-tertiary hover:opacity-90 shadow-lg"
                      onClick={() => handleQuestionClick(questionOfDay.id)}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Answer & Win Reputation
                    </Button>
                  </div>
                  <div className="w-20 md:w-28 flex items-center justify-center self-center md:self-auto">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl" />
                      <div className="relative text-5xl md:text-6xl animate-bounce">🏆</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Interesting Posts */}
          <div>
            <div className="mb-3 md:mb-4">
              <h2 className="text-lg md:text-xl font-bold text-foreground mb-1">Interesting posts for you</h2>
              <p className="text-xs md:text-sm text-muted-foreground">
                Based on your viewing history and watched tags.{" "}
                <Link to="/questions" className="text-primary hover:underline">Customize your feed</Link>
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-8 text-sm text-muted-foreground">Loading questions...</div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {interestingPosts.map((question) => (
                  <Card key={question.id} className="hover:border-primary/50 transition-colors">
                    <CardContent className="p-3 md:p-4">
                      <div className="flex gap-3 md:gap-4">
                        {/* Stats */}
                        <div className="flex flex-col gap-1.5 md:gap-2 text-xs md:text-sm min-w-[60px] md:min-w-[80px]">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <ThumbsUp className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="text-xs md:text-sm">{question.upvotes}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MessageSquare className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="text-xs md:text-sm">{question.answerCount || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Eye className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="text-xs md:text-sm">{question.views}</span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <button 
                            onClick={() => handleQuestionClick(question.id)}
                            className="text-left w-full"
                          >
                            <h3 className="text-sm md:text-base font-medium text-primary hover:text-primary-hover mb-2">
                              {question.title}
                            </h3>
                          </button>
                          <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2 md:mb-3">
                            {question.tags.map((tag) => {
                              const tagName = typeof tag === 'string' ? tag : tag.name;
                              return (
                                <Badge key={tagName} variant="secondary" className="bg-secondary/10 text-secondary hover:bg-secondary/20 text-xs">
                                  {tagName}
                                </Badge>
                              );
                            })}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] md:text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">{question.author.name}</span>
                            <span>asked {new Date(question.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="hidden lg:block w-80 p-6 space-y-6">
          {/* Watched Tags */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-foreground">Watched tags</h3>
                <button className="text-muted-foreground hover:text-foreground">⚙️</button>
              </div>
              <div className="space-y-2">
                <Badge variant="outline" className="mr-2">python</Badge>
                <Badge variant="outline">oauth-2.0</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Customize your content by watching tags.
              </p>
            </CardContent>
          </Card>

          {/* The Overflow Blog */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-3">The Overflow Blog</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <span className="text-muted-foreground">📝</span>
                  <p className="text-foreground">Our next phase—Q&A was just the beginning</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground">📝</span>
                  <p className="text-foreground">"Translation is the tip of the iceberg": A deep dive into specialty models</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured on Meta */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Featured on Meta</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <span className="text-muted-foreground">💬</span>
                  <p className="text-foreground">Icecat and Frog have joined as Community Managers</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground">💬</span>
                  <p className="text-foreground">Reopening Stack's first community-wide AMA (Ask Me Anything)</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground">⚡</span>
                  <p className="text-foreground">Stacks Editor development and testing</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-muted-foreground">⚡</span>
                  <p className="text-foreground">Policy: Generative AI (e.g., ChatGPT) is banned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hot Meta Posts */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-3">Hot Meta Posts</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <span className="text-muted-foreground">8️⃣</span>
                  <p className="text-foreground">Reputation Fraud through multiple edits</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
      
      <AskQuestionModal open={showAskModal} onOpenChange={setShowAskModal} />
      <QuestionDetailDrawer 
        questionId={selectedQuestionId || ""} 
        open={!!selectedQuestionId} 
        onOpenChange={(open) => !open && setSelectedQuestionId(null)} 
      />
      <MobileNav />
    </div>
  );
};

export default Home;
