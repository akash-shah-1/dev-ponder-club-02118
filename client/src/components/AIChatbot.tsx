import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, X, Send, Maximize2, Minimize2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { aiService } from "@/api/services/ai.service";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isAiGenerated?: boolean;
  isTyping?: boolean;
  fullContent?: string;
  suggestions?: Array<{
    id: string;
    title: string;
    tags?: string[];
    similarity?: number;
  }>;
}

// Simple fallback message when AI service is unavailable
const generateIntelligentResponse = (query: string): string => {
  return `I'm experiencing some technical difficulties right now. Please try again in a moment.\n\nIf the issue persists, you can:\n• Post your question directly to the community\n• Check our existing Q&A for similar topics\n• Try refreshing the page`;
};

export const AIChatbot = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Hi! I'm your **coding assistant** - I only help with programming questions.\n\n**What I can do:**\n• Answer coding questions from our Q&A database\n• Suggest similar questions others have asked\n• Explain errors and provide solutions\n• Share code examples and best practices\n\n**What I can't do:**\n• General chat or greetings\n• Non-coding topics\n• Personal advice\n\n**Try asking:**\n• \"How to fix undefined error in React?\"\n• \"Authentication issues in Node.js\"\n• \"Best way to handle async operations?\"\n\n💡 **Tip:** I'll search our database first and show you similar questions before answering!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Typing animation effect
  useEffect(() => {
    const typingMessages = messages.filter(m => m.isTyping && m.fullContent);
    if (typingMessages.length === 0) return;

    const lastTypingMessage = typingMessages[typingMessages.length - 1];
    const currentLength = lastTypingMessage.content.length;
    const fullLength = lastTypingMessage.fullContent!.length;

    if (currentLength < fullLength) {
      const timer = setTimeout(() => {
        setMessages(prev => prev.map(msg => {
          if (msg.id === lastTypingMessage.id && msg.isTyping) {
            const nextLength = Math.min(currentLength + 3, fullLength); // Type 3 chars at a time
            return {
              ...msg,
              content: msg.fullContent!.substring(0, nextLength),
              isTyping: nextLength < fullLength,
            };
          }
          return msg;
        }));
      }, 20); // Speed of typing (lower = faster)

      return () => clearTimeout(timer);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    const userQuery = input;
    setInput("");
    setIsTyping(true);

    try {
      // Call Gemini API with RAG
      const aiResponse = await aiService.chat(userQuery);

      // Create message with typing animation and similar questions
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "", // Start empty
        fullContent: aiResponse.answer, // Store full content
        isAiGenerated: true,
        isTyping: true, // Enable typing animation
        suggestions: aiResponse.similarQuestions?.map(sq => ({
          id: sq.id,
          title: sq.title,
          tags: sq.tags,
          similarity: sq.similarity,
        })),
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error:', error);

      // Fallback to simple error message
      const fullFallbackContent = generateIntelligentResponse(userQuery);

      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "", // Start empty for typing animation
        fullContent: fullFallbackContent,
        isAiGenerated: true,
        isTyping: true,
      };
      setMessages(prev => [...prev, fallbackMessage]);

      toast({
        title: "Connection Issue",
        description: "Unable to reach AI service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const chatContent = (
    <>
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-purple-500/10 to-blue-500/10 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-purple-600" />
        <div className="flex-1">
          <h3 className="font-semibold">Overflow Assistant</h3>
          <p className="text-xs text-muted-foreground">Your coding companion</p>
        </div>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8 w-8"
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id}>
            <div
              className={cn(
                "rounded-lg p-3 max-w-[85%] relative",
                message.role === "user"
                  ? "ml-auto bg-purple-600 text-white"
                  : message.isAiGenerated
                    ? "bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
                    : "bg-slate-100 dark:bg-slate-800"
              )}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              {message.isTyping && (
                <span className="inline-block w-1 h-4 ml-1 bg-purple-600 animate-pulse" />
              )}
            </div>

            {message.suggestions && (
              <div className="mt-3 space-y-2">
                {message.suggestions.map((suggestion) => (
                  <Link key={suggestion.id} to={`/questions/${suggestion.id}`} onClick={() => setIsOpen(false)}>
                    <div className="p-3 rounded-lg bg-card transition-colors border border-border hover:border-purple-300 ">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-sm font-medium flex-1">{suggestion.title}</h4>
                        {suggestion.similarity && (
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                            {(suggestion.similarity * 100).toFixed(0)}% match
                          </Badge>
                        )}
                      </div>
                      {suggestion.tags && suggestion.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {suggestion.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 max-w-[85%]">
            <div className="flex gap-1 items-center">
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              <span className="ml-2 text-xs text-muted-foreground">AI is thinking...</span>
            </div>
          </div>
        )}

        {/* Auto-scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-gradient-to-r from-purple-500/5 to-blue-500/5">
        <div className="flex gap-2">
          <Input
            placeholder="Ask about coding problems..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            className="flex-1 bg-white dark:bg-slate-800 border-purple-200 dark:border-purple-800 focus-visible:ring-purple-500"
            disabled={isTyping}
          />
          <Button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            size="icon"
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          💡 Be specific: mention errors, technologies, or concepts
        </p>
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
          "bottom-24 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700",
          isOpen && "rotate-0"
        )}
        size="icon"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6 animate-pulse" />}
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
          <Card className={cn(
            "fixed bottom-24 right-6 z-50 shadow-2xl border-primary/20 flex flex-col transition-all duration-300",
            isExpanded ? "w-[600px] h-[700px]" : "w-96 h-[500px]"
          )}>
            {chatContent}
          </Card>
        )
      )}
    </>
  );
};
