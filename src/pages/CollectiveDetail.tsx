import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { BookOpen, Users, Award, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCollective } from "@/hooks/useCollectives";

const CollectiveDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: collective, isLoading } = useCollective(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6">
            <div className="max-w-5xl mx-auto">Loading...</div>
          </main>
        </div>
        <MobileNav />
      </div>
    );
  }

  if (!collective) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6">
            <div className="max-w-5xl mx-auto">
              <h1 className="text-2xl font-bold">Collective not found</h1>
            </div>
          </main>
        </div>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-5xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="h-20 w-20 rounded-lg bg-primary/10 flex items-center justify-center text-4xl shrink-0">
                    {collective.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <CardTitle className="text-2xl">{collective.name}</CardTitle>
                      {collective.isOfficial && (
                        <Badge variant="default" className="gap-1">
                          <Award className="h-3 w-3" />
                          Official
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex flex-wrap items-center gap-4 mb-3">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {collective.memberCount} members
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {collective.questionCount} questions
                      </span>
                    </CardDescription>
                    <p className="text-sm mb-4">{collective.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {collective.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button className="shrink-0">Join Collective</Button>
                </div>
              </CardHeader>
            </Card>

            <Tabs defaultValue="questions" className="w-full">
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="questions" className="flex-1 md:flex-initial">Questions</TabsTrigger>
                <TabsTrigger value="members" className="flex-1 md:flex-initial">Members</TabsTrigger>
                <TabsTrigger value="about" className="flex-1 md:flex-initial">About</TabsTrigger>
              </TabsList>
              <TabsContent value="questions" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground text-center py-8">
                      No questions yet in this collective
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="members" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground text-center py-8">
                      Member list coming soon
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="about" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="prose prose-sm max-w-none">
                      <p>{collective.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default CollectiveDetail;
