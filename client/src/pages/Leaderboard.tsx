import { Trophy, TrendingUp, Award, Star } from "lucide-react";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { usersService } from "@/api";
import { getAvatarUrl } from "@/lib/avatar";

const Leaderboard = () => {
  const { data: topUsers = [] } = useQuery({
    queryKey: ['topUsers'],
    queryFn: () => usersService.getTopHelpers(10),
  });

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (index === 1) return <Trophy className="h-5 w-5 text-gray-400" />;
    if (index === 2) return <Trophy className="h-5 w-5 text-orange-600" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
              <p className="text-muted-foreground">
                Recognize top contributors helping the team learn and grow
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Helper</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{topUsers[0]?.name || "N/A"}</div>
                  <p className="text-xs text-muted-foreground">
                    {topUsers[0]?.reputation || 0} reputation points
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Best Explainer</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{topUsers[1]?.name || "N/A"}</div>
                  <p className="text-xs text-muted-foreground">
                    Highest clarity score
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12 days</div>
                  <p className="text-xs text-muted-foreground">
                    Company average
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="helpers" className="space-y-4">
              <TabsList>
                <TabsTrigger value="helpers">Top Helpers</TabsTrigger>
                <TabsTrigger value="learners">Active Learners</TabsTrigger>
                <TabsTrigger value="streaks">Learning Streaks</TabsTrigger>
              </TabsList>

              <TabsContent value="helpers" className="space-y-4">
                {topUsers.map((user, index) => (
                  <Card key={user.id} className="hover:border-primary transition-smooth">
                    <CardContent className="flex items-center gap-4 pt-6">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 text-center font-bold text-lg text-muted-foreground">
                          {getRankIcon(index) || `#${index + 1}`}
                        </div>
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar || getAvatarUrl(user.name)} alt={user.name} />
                          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <div className="font-bold text-foreground">{user.questionsAnswered}</div>
                          <div className="text-xs text-muted-foreground">Answers</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-primary">{user.reputation}</div>
                          <div className="text-xs text-muted-foreground">Reputation</div>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          {index < 3 ? "🏆 Top 3" : "⭐ Helper"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="learners" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Learners This Week</CardTitle>
                    <CardDescription>
                      Developers who are actively seeking to understand and grow
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="streaks" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Streaks</CardTitle>
                    <CardDescription>
                      Consistent daily learning and contribution patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Leaderboard;
