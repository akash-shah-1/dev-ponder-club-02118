import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Link as LinkIcon, Calendar, Award, TrendingUp } from "lucide-react";
import { useCurrentUser } from "@/hooks/useUser";
import QuestionCard from "@/components/QuestionCard";
import { useQuestions } from "@/hooks/useQuestions";
import { getAvatarUrl } from "@/lib/avatar";

const Profile = () => {
  const { data: user } = useCurrentUser();
  const { data: questions = [] } = useQuestions();
  const userQuestions = questions.slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-x-hidden">
          <div className="max-w-5xl mx-auto w-full">
            <Card className="mb-4 md:mb-6">
              <CardHeader className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6">
                  <Avatar className="h-20 w-20 sm:h-24 sm:w-24 md:h-32 md:w-32 flex-shrink-0">
                    <AvatarImage src={user?.avatar || getAvatarUrl(user?.name || 'User')} />
                    <AvatarFallback className="text-xl sm:text-2xl md:text-4xl">
                      {user?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 w-full min-w-0">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-2 mb-2">
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate max-w-full">{user?.name || "John Doe"}</h1>
                      <Button size="sm" className="whitespace-nowrap flex-shrink-0">Edit Profile</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 justify-center sm:justify-start">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="text-xs md:text-sm">San Francisco, CA</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <LinkIcon className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="text-xs md:text-sm">github.com/johndoe</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                        <span className="text-xs md:text-sm">Joined 2 years ago</span>
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-3 md:mb-4 text-center sm:text-left">
                      Full-stack developer passionate about React, TypeScript, and building scalable applications.
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 md:gap-2">
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Award className="h-3 w-3" />
                        {user?.reputation || 1250} rep
                      </Badge>
                      <Badge variant="secondary" className="text-xs">🥇 5</Badge>
                      <Badge variant="secondary" className="text-xs">🥈 12</Badge>
                      <Badge variant="secondary" className="text-xs">🥉 28</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-6 mb-4 md:mb-6">
              <Card>
                <CardHeader className="p-2 sm:p-3 md:p-6">
                  <CardTitle className="text-xs sm:text-sm md:text-lg">Questions</CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 md:p-6 pt-0">
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold">24</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-2 sm:p-3 md:p-6">
                  <CardTitle className="text-xs sm:text-sm md:text-lg">Answers</CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 md:p-6 pt-0">
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold">156</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-2 sm:p-3 md:p-6">
                  <CardTitle className="text-xs sm:text-sm md:text-lg">Reach</CardTitle>
                </CardHeader>
                <CardContent className="p-2 sm:p-3 md:p-6 pt-0">
                  <p className="text-lg sm:text-2xl md:text-3xl font-bold">12.5k</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="w-full justify-start overflow-x-auto flex-nowrap scrollbar-thin">
                <TabsTrigger value="activity" className="text-xs sm:text-sm whitespace-nowrap">Activity</TabsTrigger>
                <TabsTrigger value="questions" className="text-xs sm:text-sm whitespace-nowrap">Questions</TabsTrigger>
                <TabsTrigger value="answers" className="text-xs sm:text-sm whitespace-nowrap">Answers</TabsTrigger>
                <TabsTrigger value="tags" className="text-xs sm:text-sm whitespace-nowrap">Tags</TabsTrigger>
                <TabsTrigger value="badges" className="text-xs sm:text-sm whitespace-nowrap">Badges</TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="mt-4 md:mt-6">
                <Card>
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-base md:text-lg">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-xs md:text-sm">
                        <Badge variant="outline" className="text-xs">Answer</Badge>
                        <span className="flex-1">Answered "How to optimize React performance?"</span>
                        <span className="text-muted-foreground text-xs">2 hours ago</span>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-xs md:text-sm">
                        <Badge variant="outline" className="text-xs">Question</Badge>
                        <span className="flex-1">Asked "Best practices for TypeScript generics"</span>
                        <span className="text-muted-foreground text-xs">1 day ago</span>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-xs md:text-sm">
                        <Badge variant="outline" className="text-xs">Badge</Badge>
                        <span className="flex-1">Earned "Great Answer" badge</span>
                        <span className="text-muted-foreground text-xs">3 days ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="questions" className="mt-4 md:mt-6 space-y-4">
                {userQuestions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    id={question.id}
                    title={question.title}
                    excerpt={question.excerpt}
                    tags={question.tags}
                    author={question.author}
                    stats={{
                      views: question.views,
                      answers: question.answerCount || 0,
                      solved: false,
                    }}
                    timestamp={new Date(question.createdAt).toLocaleDateString()}
                  />
                ))}
              </TabsContent>

              <TabsContent value="answers" className="mt-4 md:mt-6">
                <p className="text-sm text-muted-foreground">No answers to display</p>
              </TabsContent>

              <TabsContent value="tags" className="mt-4 md:mt-6">
                <div className="flex flex-wrap gap-2">
                  {["React", "TypeScript", "JavaScript", "Node.js", "CSS"].map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs md:text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="badges" className="mt-4 md:mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {["Great Answer", "Good Question", "Notable Question", "Popular Question"].map((badge) => (
                    <Card key={badge}>
                      <CardContent className="p-3 md:p-4 flex items-center gap-3">
                        <Award className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                        <span className="text-sm md:text-base font-medium">{badge}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default Profile;
