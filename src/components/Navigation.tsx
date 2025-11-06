import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, Bell, Menu, Moon, Sun, Home, MessageSquare, Tag, Users } from "lucide-react";
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
import { useNotifications } from "@/hooks/useNotifications";

const Navigation = () => {
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [showSearchDrawer, setShowSearchDrawer] = useState(false);
  const [showAskModal, setShowAskModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: questions = [] } = useQuestions();
  const { data: currentUser } = useCurrentUser();
  const { notifications } = useNotifications();
  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();

  return (
    <>
      <nav className="sticky top-0 z-50 border-b bg-card shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Mobile Menu Button */}
            <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <div className="flex flex-col h-full">
                  {/* Logo in Menu */}
                  <div className="p-6 border-b border-border">
                    <Link to="/" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary via-tertiary to-accent rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                          <path d="M10 17l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="white" opacity="0.8"/>
                        </svg>
                      </div>
                      <div>
                        <div className="font-bold text-lg text-foreground">Stack Overflow</div>
                        <div className="text-xs text-muted-foreground">Developer Community</div>
                      </div>
                    </Link>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="flex-1 py-4">
                    <div className="space-y-1 px-3">
                      <Link 
                        to="/" 
                        onClick={() => setShowMobileMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <Home className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">Home</span>
                      </Link>
                      <Link 
                        to="/questions" 
                        onClick={() => setShowMobileMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">Questions</span>
                      </Link>
                      <Link 
                        to="/tags" 
                        onClick={() => setShowMobileMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <Tag className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">Tags</span>
                      </Link>
                      <Link 
                        to="/users" 
                        onClick={() => setShowMobileMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">Users</span>
                      </Link>
                    </div>
                    
                    <div className="h-px bg-border my-4 mx-3" />
                    
                    {/* Theme Toggle */}
                    <div className="px-3">
                      <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        {theme === "dark" ? (
                          <Sun className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Moon className="h-5 w-5 text-muted-foreground" />
                        )}
                        <span className="text-sm font-medium">
                          {theme === "dark" ? "Light Mode" : "Dark Mode"}
                        </span>
                      </button>
                    </div>
                    
                    <div className="h-px bg-border my-4 mx-3" />
                    
                    {/* Profile */}
                    <div className="px-3">
                      <Link 
                        to="/profile" 
                        onClick={() => setShowMobileMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <Avatar className="h-8 w-8 border-2 border-primary/20">
                          <AvatarImage src={currentUser?.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {currentUser?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{currentUser?.name || "User"}</div>
                          <div className="text-xs text-muted-foreground">View Profile</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 flex-1">
              <Link to="/knowledge">
                <Button variant="ghost" size="sm">Knowledge</Button>
              </Link>
              <Link to="/leaderboard">
                <Button variant="ghost" size="sm">Leaderboard</Button>
              </Link>
              <Link to="/help">
                <Button variant="ghost" size="sm">Help</Button>
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Desktop Search */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex"
                onClick={() => setShowSearchDialog(true)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Mobile Search */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setShowSearchDrawer(true)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Notifications */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-[10px] font-medium rounded-full flex items-center justify-center">
                        {notifications.filter(n => !n.read).length}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <NotificationPanel />
                </PopoverContent>
              </Popover>

              {/* Ask Question - Desktop */}
              <Link to="/ask" className="hidden md:block">
                <Button size="sm" className="ml-2">Ask Question</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Global Search Command Dialog - Desktop */}
      <CommandDialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
        <CommandInput placeholder="Search questions, tags, users..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Recent Questions">
            {questions.slice(0, 5).map((question) => (
              <CommandItem
                key={question.id}
                onSelect={() => {
                  setShowSearchDialog(false);
                  navigate(`/questions/${question.id}`);
                }}
              >
                <Search className="mr-2 h-4 w-4" />
                <span>{question.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Quick Links">
            <CommandItem onSelect={() => { setShowSearchDialog(false); navigate("/questions"); }}>
              Questions
            </CommandItem>
            <CommandItem onSelect={() => { setShowSearchDialog(false); navigate("/tags"); }}>
              Tags
            </CommandItem>
            <CommandItem onSelect={() => { setShowSearchDialog(false); navigate("/users"); }}>
              Users
            </CommandItem>
            <CommandItem onSelect={() => { setShowSearchDialog(false); navigate("/ask"); }}>
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
