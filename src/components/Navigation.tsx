import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, User, Bell, Menu, Moon, Sun, BookOpen, Award, Settings, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
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
import { useCurrentUser } from "@/hooks/useUser";

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const [showSearchDrawer, setShowSearchDrawer] = useState(false);
  const [showAskModal, setShowAskModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: questions = [] } = useQuestions();
  const { data: currentUser } = useCurrentUser();
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();

  const menuItems = [
    { icon: BookOpen, label: "Knowledge", path: "/knowledge" },
    { icon: Award, label: "Leaderboard", path: "/leaderboard" },
    { icon: HelpCircle, label: "Help & FAQ", path: "/help" },
  ];

  const handleSearch = () => {
    if (isMobile) {
      setShowSearchDrawer(true);
    } else {
      setOpen(true);
    }
  };

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
                <SheetContent side="left" className="p-0 w-72">
                  <div className="p-6">
                    {/* Logo in Menu */}
                    <Link to="/" className="flex items-center gap-3 mb-6">
                      <div className="flex items-center justify-center w-10 h-10 rounded bg-primary text-primary-foreground">
                        <span className="text-xl font-bold">D</span>
                      </div>
                      <span className="font-bold text-xl">DevOverFlow</span>
                    </Link>

                    <Separator className="mb-6" />

                    {/* Profile Section */}
                    <Link to="/profile" className="block mb-6">
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={currentUser?.avatar} />
                          <AvatarFallback>{currentUser?.name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">{currentUser?.name || "User"}</div>
                          <div className="text-sm text-muted-foreground">
                            {currentUser?.reputation || 0} reputation
                          </div>
                        </div>
                      </div>
                    </Link>

                    <Separator className="mb-4" />

                    {/* Theme Toggle */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between px-3 py-2">
                        <span className="text-sm font-medium">Theme</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                          className="gap-2"
                        >
                          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                          <span className="ml-5">{theme === "dark" ? "Dark" : "Light"}</span>
                        </Button>
                      </div>
                    </div>

                    <Separator className="mb-4" />

                    {/* Menu Items */}
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
                onClick={handleSearch}
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
              onClick={handleSearch}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
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

      {/* Global Search Command Dialog - Desktop */}
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

      {/* Global Search Drawer - Mobile */}
      <Drawer open={showSearchDrawer} onOpenChange={setShowSearchDrawer}>
        <DrawerContent>
          <div className="p-4 max-h-[80vh] overflow-y-auto">
            <h3 className="font-semibold text-lg mb-4">Search</h3>
            <input
              type="text"
              placeholder="Search questions, tags, users..."
              className="w-full px-4 py-2 rounded-md border bg-background mb-4"
              autoFocus
            />
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Recent Questions</h4>
                <div className="space-y-2">
                  {questions.slice(0, 5).map((question) => (
                    <button
                      key={question.id}
                      onClick={() => {
                        setShowSearchDrawer(false);
                        navigate(`/questions/${question.id}`);
                      }}
                      className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <Search className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <span className="text-sm">{question.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Quick Links</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => { setShowSearchDrawer(false); navigate("/questions"); }}
                    className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors text-sm"
                  >
                    Questions
                  </button>
                  <button
                    onClick={() => { setShowSearchDrawer(false); navigate("/tags"); }}
                    className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors text-sm"
                  >
                    Tags
                  </button>
                  <button
                    onClick={() => { setShowSearchDrawer(false); navigate("/users"); }}
                    className="w-full text-left p-3 rounded-md hover:bg-muted transition-colors text-sm"
                  >
                    Users
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      <AskQuestionModal open={showAskModal} onOpenChange={setShowAskModal} />
    </>
  );
};

export default Navigation;
