import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { MessageCircle, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const mockDiscussions = [
  {
    id: 1,
    title: "What's your favorite React state management solution?",
    author: { name: "Alice Chen", avatar: "" },
    replies: 24,
    views: 1200,
    tags: ["React", "State Management"],
    timeAgo: "2 hours ago",
    trending: true,
  },
  {
    id: 2,
    title: "Best practices for API security in 2024",
    author: { name: "Bob Smith", avatar: "" },
    replies: 18,
    views: 850,
    tags: ["Security", "API"],
    timeAgo: "5 hours ago",
    trending: false,
  },
  {
    id: 3,
    title: "Microservices vs Monolith - When to choose what?",
    author: { name: "Carol Wang", avatar: "" },
    replies: 42,
    views: 2100,
    tags: ["Architecture", "Microservices"],
    timeAgo: "1 day ago",
    trending: true,
  },
];

const Discussions = () => {
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

            <div className="grid gap-4">
              {mockDiscussions.map((discussion) => (
                <Card key={discussion.id} className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {discussion.trending && (
                            <Badge variant="default" className="gap-1">
                              <TrendingUp className="h-3 w-3" />
                              Trending
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg mb-2">{discussion.title}</CardTitle>
                        <CardDescription className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={discussion.author.avatar} />
                              <AvatarFallback>{discussion.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <span>{discussion.author.name}</span>
                          </div>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {discussion.timeAgo}
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
                        <span>{discussion.replies} replies</span>
                        <span>{discussion.views} views</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Discussions;
