import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, User, Bell, Menu, Moon, Sun, BookOpen, Award, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NotificationPanel from "./NotificationPanel";
import { useQuestions } from "@/hooks/useQuestions";
import { cn } from "@/lib/utils";
import { AskQuestionModal } from "./AskQuestionModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "next-themes";

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const [showAskModal, setShowAskModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: questions = [] } = useQuestions();
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();

  const menuItems = [
    { icon: BookOpen, label: "Knowledge", path: "/knowledge" },
    { icon: Award, label: "Leaderboard", path: "/leaderboard" },
    { icon: Settings, label: "Profile", path: "/profile" },
    { icon: HelpCircle, label: "Help & FAQ", path: "/help" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 border-b bg-card shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Menu + Logo */}
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
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
                  </div>
                </SheetContent>
              </Sheet>

              <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                <div className="flex items-center justify-center w-8 h-8 rounded bg-primary text-primary-foreground">
                  <span className="text-lg">D</span>
                </div>
                <span className="hidden sm:inline">DevOverFlow</span>
              </Link>
            </div>

            {/* Global Search */}
            <div className="flex-1 max-w-2xl hidden sm:block">
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground hover:text-foreground"
                onClick={() => setOpen(true)}
              >
                <Search className="mr-2 h-4 w-4" />
                Search questions...
                <kbd className="ml-auto pointer-events-none hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            </div>

            {/* Mobile Search Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={() => setOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                      3
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <NotificationPanel />
                </PopoverContent>
              </Popover>
              <Link to="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              {isMobile ? (
                <Button onClick={() => setShowAskModal(true)} variant="default" size="sm">Ask</Button>
              ) : (
                <Link to="/ask">
                  <Button variant="default">Ask Question</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Global Search Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search questions, tags, users..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Recent Questions">
            {questions.slice(0, 5).map((question) => (
              <CommandItem
                key={question.id}
                onSelect={() => {
                  setOpen(false);
                  navigate(`/questions/${question.id}`);
                }}
              >
                <Search className="mr-2 h-4 w-4" />
                <span>{question.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Quick Links">
            <CommandItem onSelect={() => { setOpen(false); navigate("/questions"); }}>
              Questions
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); navigate("/tags"); }}>
              Tags
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); navigate("/users"); }}>
              Users
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); navigate("/ask"); }}>
              Ask Question
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <AskQuestionModal open={showAskModal} onOpenChange={setShowAskModal} />
    </>
  );
};

export default Navigation;
