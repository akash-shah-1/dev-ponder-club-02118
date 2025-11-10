import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { MessageCircle, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDiscussions } from "@/hooks/useDiscussions";
import { formatDistanceToNow } from "date-fns";
import { getAvatarUrl } from "@/lib/avatar";

const Discussions = () => {
  const { data: discussions, isLoading } = useDiscussions();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold">Discussions</h1>
              </div>
              <Button>Start Discussion</Button>
            </div>

            <p className="text-muted-foreground mb-6">
              Open-ended conversations about software development
            </p>

            {isLoading ? (
              <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <Skeleton className="h-6 w-3/4" />
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-4">
                {discussions?.map((discussion) => (
                  <Card 
                    key={discussion.id} 
                    className="hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/discussions/${discussion.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {discussion.isPinned && (
                              <Badge variant="default" className="gap-1">
                                <TrendingUp className="h-3 w-3" />
                                Pinned
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg mb-2">{discussion.title}</CardTitle>
                          <CardDescription className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={discussion.author.avatar || getAvatarUrl(discussion.author.name)} />
                                <AvatarFallback>{discussion.author.name[0]}</AvatarFallback>
                              </Avatar>
                              <span>{discussion.author.name}</span>
                            </div>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(discussion.createdAt), { addSuffix: true })}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {discussion.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{discussion.replyCount} replies</span>
                        </div>
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

export default Discussions;
