import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, X, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  suggestions?: Array<{
    id: string;
    title: string;
    tags: string[];
    relevance: number;
  }>;
}

export const AIChatbot = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm your AI assistant. Describe your problem and I'll help you find relevant questions."
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I found some relevant questions that might help:",
        suggestions: [
          {
            id: '1',
            title: 'How to implement JWT authentication in React with proper token refresh?',
            tags: ['react', 'jwt', 'authentication'],
            relevance: 95
          },
          {
            id: '2',
            title: 'Best practices for React authentication patterns',
            tags: ['react', 'security', 'best-practices'],
            relevance: 88
          },
          {
            id: '3',
            title: 'TypeScript generic constraints with React components',
            tags: ['typescript', 'react', 'generics'],
            relevance: 82
          },
        ]
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const chatContent = (
    <>
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-accent/10 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-semibold flex-1">AI Question Finder</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            <div
              className={cn(
                "rounded-lg p-3 max-w-[85%]",
                message.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <p className="text-sm">{message.content}</p>
            </div>

            {message.suggestions && (
              <div className="mt-3 space-y-2">
                {message.suggestions.map((suggestion) => (
                  <Link key={suggestion.id} to={`/questions/${suggestion.id}`} onClick={() => setIsOpen(false)}>
                    <div className="p-3 rounded-lg bg-card hover:bg-accent/10 transition-colors border border-border">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-medium flex-1">{suggestion.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {suggestion.relevance}%
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {suggestion.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="bg-muted rounded-lg p-3 max-w-[85%]">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Describe your problem..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={isTyping || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg transition-all md:bottom-6",
          "bottom-24",
          isOpen && "rotate-0"
        )}
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
      </Button>

      {/* Chat Window - Drawer on Mobile, Card on Desktop */}
      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="h-[90vh] flex flex-col">
            {chatContent}
          </DrawerContent>
        </Drawer>
      ) : (
        isOpen && (
          <Card className="fixed bottom-24 right-6 z-50 w-96 h-[500px] shadow-2xl border-primary/20 flex flex-col">
            {chatContent}
          </Card>
        )
      )}
    </>
  );
};
