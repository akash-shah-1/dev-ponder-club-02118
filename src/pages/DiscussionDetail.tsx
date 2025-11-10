import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { MessageCircle, Clock, ThumbsUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDiscussion } from "@/hooks/useDiscussions";
import { formatDistanceToNow } from "date-fns";
import { getAvatarUrl } from "@/lib/avatar";

const DiscussionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: discussion, isLoading } = useDiscussion(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">Loading...</div>
          </main>
        </div>
        <MobileNav />
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold">Discussion not found</h1>
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
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  {discussion.isPinned && (
                    <Badge variant="default">Pinned</Badge>
                  )}
                  <Badge variant="secondary">{discussion.category}</Badge>
                </div>
                <CardTitle className="text-xl md:text-2xl">{discussion.title}</CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-3 mt-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
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
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <p>{discussion.content}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {discussion.tags?.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 pt-4 border-t">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    {discussion.upvotes}
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {discussion.replyCount} replies
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add a Reply</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Share your thoughts..."
                  className="min-h-[100px] mb-3"
                />
                <Button>Post Reply</Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default DiscussionDetail;
