import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, Tag, Users, Menu, Settings, HelpCircle, BookOpen, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Sidebar from "./Sidebar";

export const MobileNav = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: MessageSquare, label: "Questions", path: "/questions" },
    { icon: Tag, label: "Tags", path: "/tags" },
    { icon: Users, label: "Users", path: "/users" },
  ];

  const menuItems = [
    { icon: BookOpen, label: "Knowledge", path: "/knowledge" },
    { icon: Award, label: "Leaderboard", path: "/leaderboard" },
    { icon: Settings, label: "Profile", path: "/profile" },
    { icon: HelpCircle, label: "Help & FAQ", path: "/help" },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-lg">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                  isActive
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
          
          {/* Menu trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center justify-center flex-1 h-full text-muted-foreground hover:text-foreground"
              >
                <Menu className="h-5 w-5" />
                <span className="text-xs mt-1">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-4">Menu</h3>
                <div className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase px-3 mb-2">
                    Quick Access
                  </h4>
                  <Sidebar />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Spacer for bottom nav */}
      <div className="md:hidden h-16" />
    </>
  );
};
