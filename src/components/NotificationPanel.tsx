import { Bell, MessageSquare, Award, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

const mockNotifications = [
  {
    id: 1,
    type: "answer",
    icon: MessageSquare,
    title: "New answer to your question",
    description: 'Someone answered "How to optimize React performance?"',
    timeAgo: "5 minutes ago",
    unread: true,
  },
  {
    id: 2,
    type: "badge",
    icon: Award,
    title: "You earned a new badge!",
    description: "Great Answer - Answer was upvoted 25 times",
    timeAgo: "2 hours ago",
    unread: true,
  },
  {
    id: 3,
    type: "mention",
    icon: Users,
    title: "You were mentioned",
    description: "Alice Chen mentioned you in a comment",
    timeAgo: "1 day ago",
    unread: false,
  },
  {
    id: 4,
    type: "trending",
    icon: TrendingUp,
    title: "Your question is trending",
    description: "Your question reached 1,000 views",
    timeAgo: "2 days ago",
    unread: false,
  },
];

const NotificationPanel = () => {
  return (
    <Card className="w-[90vw] sm:w-96 max-w-md">
      <CardHeader className="flex flex-row items-center justify-between pb-3 p-3 sm:p-6">
        <CardTitle className="text-base sm:text-lg flex items-center gap-2">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Notifications</span>
        </CardTitle>
        <Badge variant="secondary" className="text-xs">3 new</Badge>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] sm:h-[400px]">
          <div className="divide-y">
            {mockNotifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`p-3 sm:p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                    notification.unread ? "bg-muted/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className={`p-1.5 sm:p-2 rounded-full ${notification.unread ? "bg-primary/10" : "bg-muted"}`}>
                      <Icon className={`h-3 w-3 sm:h-4 sm:w-4 ${notification.unread ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-xs sm:text-sm">{notification.title}</p>
                        {notification.unread && (
                          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                        {notification.description}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                        {notification.timeAgo}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;
