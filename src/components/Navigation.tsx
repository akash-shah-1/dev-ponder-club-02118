import { Link, useNavigate } from "react-router-dom";
import { Search, User, Bell } from "lucide-react";
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
import NotificationPanel from "./NotificationPanel";
import { useQuestions } from "@/hooks/useQuestions";

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { data: questions = [] } = useQuestions();

  return (
    <>
      <nav className="sticky top-0 z-50 border-b bg-card shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <div className="flex items-center justify-center w-8 h-8 rounded bg-primary text-primary-foreground">
                <span className="text-lg">D</span>
              </div>
              <span className="hidden sm:inline">DevOverFlow</span>
            </Link>

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
              <Link to="/ask" className="hidden sm:block">
                <Button variant="default">Ask Question</Button>
              </Link>
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
    </>
  );
};

export default Navigation;
