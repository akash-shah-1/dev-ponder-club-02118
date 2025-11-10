import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { BookOpen, Users, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollectives } from "@/hooks/useCollectives";

const Collectives = () => {
  const { data: collectives, isLoading } = useCollectives();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold">Collectives</h1>
              </div>
              <Button>Create Collective</Button>
            </div>

            <p className="text-muted-foreground mb-6">
              Community-led groups where members share knowledge and connect around shared technologies
            </p>

            {isLoading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-14 w-14 rounded" />
                          <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <div className="flex gap-4">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </div>
                        </div>
                        <Skeleton className="h-10 w-20" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                {collectives?.map((collective) => (
                  <Card 
                    key={collective.id}
                    className="hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/collectives/${collective.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center text-3xl">
                            {collective.name[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle>{collective.name}</CardTitle>
                              {collective.isOfficial && (
                                <Badge variant="default" className="gap-1">
                                  <Award className="h-3 w-3" />
                                  Official
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="flex items-center gap-4 mt-2">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {collective.memberCount} members
                              </span>
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                {collective.questionCount} questions
                              </span>
                            </CardDescription>
                          </div>
                        </div>
                        <Button>Join</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">
                        {collective.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {collective.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Collectives;
