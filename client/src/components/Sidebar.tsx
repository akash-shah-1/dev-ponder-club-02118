import { Link, useLocation } from "react-router-dom";
import { Home, MessageSquare, Tag, Users, Trophy, BookOpen, Bookmark, Building2, HelpCircle, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const location = useLocation();

  const mainNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: MessageSquare, label: "Questions", path: "/questions" },
  ];

  const secondaryNavItems = [
    { icon: Bookmark, label: "Saves", path: "/saves" },
  ];

  const labsItems = [
    { icon: MessageCircle, label: "Discussions", path: "/discussions" },
  ];

  const collectivesItems = [
    { icon: BookOpen, label: "Explore all Collectives", path: "/collectives" },
  ];

  return (
    <aside className="hidden md:block w-48 bg-background border-r border-border min-h-screen pt-6">
      <nav className="space-y-6 px-2">
        {/* Main Navigation */}
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-muted/50 text-foreground font-medium border-r-2 border-primary"
                    : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Secondary Navigation */}
        <div className="space-y-1">
          {secondaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-muted/50 text-foreground font-medium border-r-2 border-primary"
                    : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* LABS Section */}
        <div>
          <div className="flex items-center gap-2 px-3 mb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase">LABS</h3>
            <HelpCircle className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            {labsItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-muted/50 text-foreground font-medium border-r-2 border-primary"
                      : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* COLLECTIVES Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase">COLLECTIVES</h3>
            <button className="text-muted-foreground hover:text-foreground text-lg">+</button>
          </div>
          <p className="text-xs text-muted-foreground px-3 mb-2">
            Community-led groups for enthusiasts and experts
          </p>
          <div className="space-y-1">
            {collectivesItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors",
                    isActive
                      ? "bg-muted/50 text-foreground font-medium border-r-2 border-primary"
                      : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

      </nav>
    </aside>
  );
};

export default Sidebar;
