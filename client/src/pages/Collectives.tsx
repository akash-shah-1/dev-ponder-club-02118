import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { CreateCollectiveModal } from "@/components/CreateCollectiveModal";
import { BookOpen, Users, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCollectives } from "@/hooks/useCollectives";

const Collectives = () => {
  const { data: collectives, isLoading } = useCollectives();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                <h1 className="text-xl md:text-3xl font-bold">Collectives</h1>
              </div>
              <Button onClick={() => setShowCreateModal(true)} className="shrink-0">Create Collective</Button>
            </div>

            <p className="text-sm md:text-base text-muted-foreground mb-6">
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
                    onClick={() => navigate(`/collectives/${collective.id}`)}
                  >
                    <CardHeader>
                      <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-4">
                        <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
                          <div className="h-12 w-12 md:h-14 md:w-14 rounded-lg bg-primary/10 flex items-center justify-center text-2xl md:text-3xl shrink-0">
                            {collective.name[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <CardTitle className="text-lg md:text-xl">{collective.name}</CardTitle>
                              {collective.isOfficial && (
                                <Badge variant="default" className="gap-1">
                                  <Award className="h-3 w-3" />
                                  Official
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="flex flex-wrap items-center gap-3 md:gap-4 mt-2 text-xs md:text-sm">
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
                        <Button className="w-full md:w-auto shrink-0">Join</Button>
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
      <MobileNav />
      <CreateCollectiveModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </div>
  );
};

export default Collectives;
