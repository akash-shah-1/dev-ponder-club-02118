import { Search } from "lucide-react";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReputationBadge from "@/components/ReputationBadge";
import { useQuery } from "@tanstack/react-query";
import { usersService } from "@/api";

const Users = () => {
  const { data: topUsers = [] } = useQuery({
    queryKey: ['topUsers'],
    queryFn: () => usersService.getTopHelpers(20),
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Users</h1>
              <p className="text-muted-foreground">
                Connect with helpful developers in your organization
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {topUsers.map((user) => (
                <Card key={user.id} className="hover:border-primary transition-smooth cursor-pointer">
                  <CardHeader>
                    <div className="flex flex-col items-center text-center space-y-3">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.role}</p>
                      </div>
                      <ReputationBadge reputation={user.reputation} />
                      <div className="flex gap-4 text-sm text-muted-foreground pt-2">
                        <div>
                          <div className="font-semibold text-foreground">{user.questionsAnswered}</div>
                          <div className="text-xs">answered</div>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{user.questionsAsked}</div>
                          <div className="text-xs">asked</div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default Users;
