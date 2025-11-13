import { Bell, MessageSquare, Award, TrendingUp, Users, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

const NOTIFICATION_ICONS = {
  answer: MessageSquare,
  comment: MessageSquare,
  upvote: TrendingUp,
  accepted: Award,
  mention: Users,
  badge: Award,
  follow: Users,
  system: Bell,
} as const;

const NotificationPanel = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();

  const handleNotificationClick = (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead(notificationId);
    }
  };

  return (
    <Card className="w-[calc(100vw-2rem)] sm:w-[400px] md:w-[420px] max-w-[95vw]">
      <CardHeader className="flex flex-row items-center justify-between pb-3 p-3 sm:p-4 md:p-6 space-y-0">
        <CardTitle className="text-sm sm:text-base md:text-lg flex items-center gap-2">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span>Notifications</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <>
              <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2">
                {unreadCount} new
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-[10px] sm:text-xs h-7 px-2"
              >
                Mark all read
              </Button>
            </>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[50vh] sm:h-[400px] md:h-[500px]">
            <div className="divide-y divide-border">
              {notifications.map((notification) => {
                const Icon = NOTIFICATION_ICONS[notification.type] || Bell;
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "group relative p-3 sm:p-4 hover:bg-muted/50 cursor-pointer transition-colors",
                      !notification.read && "bg-primary/5 border-l-2 border-l-primary"
                    )}
                    onClick={() => handleNotificationClick(notification.id, notification.read)}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div 
                        className={cn(
                          "p-1.5 sm:p-2 rounded-full flex-shrink-0",
                          !notification.read ? "bg-primary/10" : "bg-muted"
                        )}
                      >
                        <Icon 
                          className={cn(
                            "h-3.5 w-3.5 sm:h-4 sm:w-4",
                            !notification.read ? "text-primary" : "text-muted-foreground"
                          )} 
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0 pr-6">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className={cn(
                            "text-xs sm:text-sm leading-tight",
                            !notification.read ? "font-semibold" : "font-medium"
                          )}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                          )}
                        </div>
                        
                        <p className="text-[11px] sm:text-sm text-muted-foreground line-clamp-2 mb-1">
                          {notification.message}
                        </p>
                        
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          {new Date(notification.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;
