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

// Generate intelligent AI response based on query
const generateIntelligentResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();

  // Detect common patterns and provide educational answers
  if (lowerQuery.includes('undefined') || lowerQuery.includes('cannot read property')) {
    return `## Understanding "Undefined" Errors\n\n**Root Cause:**\nThis error occurs when you try to access a property or method on a variable that hasn't been initialized or is \`undefined\`.\n\n**Common Scenarios:**\n\n1. **Accessing nested properties:**\n\`\`\`javascript\nconst user = {};\nconsole.log(user.profile.name); // Error: Cannot read property 'name' of undefined\n\`\`\`\n\n2. **Async data not loaded yet:**\n\`\`\`javascript\n// Data from API not ready\nconst userName = user.name; // user is undefined\n\`\`\`\n\n**Solutions:**\n\n1. **Optional Chaining (Recommended):**\n\`\`\`javascript\nconst userName = user?.profile?.name;\n\`\`\`\n\n2. **Conditional Check:**\n\`\`\`javascript\nconst userName = user && user.profile && user.profile.name;\n\`\`\`\n\n3. **Default Values:**\n\`\`\`javascript\nconst userName = user?.profile?.name || 'Guest';\n\`\`\`\n\n**Why This Works:**\nOptional chaining (\`?.\`) safely accesses nested properties. If any part is \`undefined\`, it returns \`undefined\` instead of throwing an error.\n\n**Next Steps:**\n1. Check where the variable is initialized\n2. Ensure async data is loaded before accessing\n3. Add proper error handling`;
  }

  if (lowerQuery.includes('auth') || lowerQuery.includes('authentication') || lowerQuery.includes('unauthorized')) {
    return `## Understanding Authentication Issues\n\n**Root Cause:**\nAuthentication errors typically occur when:\n1. Token is missing or expired\n2. Token isn't being sent with requests\n3. Backend can't verify the token\n\n**Common Issues in React:**\n\n**1. Token Not Being Sent:**\n\`\`\`javascript\n// ❌ Wrong - no token\nfetch('/api/data')\n\n// ✅ Correct - include token\nfetch('/api/data', {\n  headers: {\n    'Authorization': \`Bearer \${token}\`\n  }\n})\n\`\`\`\n\n**2. Token Expired:**\n\`\`\`javascript\n// Check token expiration\nconst isTokenExpired = () => {\n  const token = localStorage.getItem('token');\n  if (!token) return true;\n  \n  const payload = JSON.parse(atob(token.split('.')[1]));\n  return payload.exp * 1000 < Date.now();\n};\n\`\`\`\n\n**3. API Client Not Initialized:**\n\`\`\`javascript\n// Make sure to initialize with auth\nimport { useApiClient } from '@/lib/api-client';\n\nfunction App() {\n  useApiClient(); // This sets up auth for all requests\n  return <YourApp />;\n}\n\`\`\`\n\n**Solution Steps:**\n\n1. **Check if token exists:**\n\`\`\`javascript\nconst token = await getToken();\nif (!token) {\n  // Redirect to login\n}\n\`\`\`\n\n2. **Ensure token is sent:**\n- Use an API client that automatically adds auth headers\n- Or manually add Authorization header to each request\n\n3. **Handle token refresh:**\n- Implement token refresh logic\n- Redirect to login if refresh fails\n\n**For your specific case:**\nThe "Unauthorized" error suggests your API client isn't sending the auth token. Make sure you've initialized \`useApiClient()\` in your App.tsx!`;
  }

  if (lowerQuery.includes('async') || lowerQuery.includes('await') || lowerQuery.includes('promise')) {
    return `## Understanding Async/Await\n\n**What It Is:**\nAsync/await is a way to handle asynchronous operations in JavaScript, making async code look and behave more like synchronous code.\n\n**Basic Concept:**\n\n\`\`\`javascript\n// Without async/await (Promise chains)\nfetchData()\n  .then(data => processData(data))\n  .then(result => console.log(result))\n  .catch(error => console.error(error));\n\n// With async/await (cleaner)\nasync function getData() {\n  try {\n    const data = await fetchData();\n    const result = await processData(data);\n    console.log(result);\n  } catch (error) {\n    console.error(error);\n  }\n}\n\`\`\`\n\n**Key Rules:**\n\n1. **\`async\` keyword** - Makes function return a Promise\n2. **\`await\` keyword** - Pauses execution until Promise resolves\n3. **Can only use \`await\` inside \`async\` functions**\n\n**Common Patterns:**\n\n**1. API Calls:**\n\`\`\`javascript\nconst fetchUser = async (id) => {\n  const response = await fetch(\`/api/users/\${id}\`);\n  const user = await response.json();\n  return user;\n};\n\`\`\`\n\n**2. Error Handling:**\n\`\`\`javascript\ntry {\n  const data = await riskyOperation();\n} catch (error) {\n  console.error('Failed:', error);\n}\n\`\`\`\n\n**3. Multiple Parallel Requests:**\n\`\`\`javascript\n// Sequential (slow)\nconst user = await fetchUser();\nconst posts = await fetchPosts();\n\n// Parallel (fast)\nconst [user, posts] = await Promise.all([\n  fetchUser(),\n  fetchPosts()\n]);\n\`\`\`\n\n**Why This Matters:**\n- Makes async code easier to read\n- Better error handling with try/catch\n- Avoids "callback hell"`;
  }

  // Generic helpful response
  return `## Let Me Help You Understand\n\n**Your Question:** "${query}"\n\n**General Approach to Debugging:**\n\n1. **Understand the Error:**\n   - Read the error message carefully\n   - Note the file and line number\n   - Identify what operation failed\n\n2. **Check Common Issues:**\n   - Variable initialization\n   - Async timing problems\n   - Missing dependencies\n   - Incorrect data types\n\n3. **Debug Steps:**\n   \`\`\`javascript\n   // Add console logs\n   console.log('Variable value:', yourVariable);\n   console.log('Type:', typeof yourVariable);\n   \`\`\`\n\n4. **Search for Specifics:**\n   - Copy the exact error message\n   - Include technology names (React, Node.js, etc.)\n   - Mention what you've tried\n\n**To Get Better Help:**\n\n1. **Create a detailed question** with:\n   - Exact error message\n   - Code snippet showing the problem\n   - What you expected vs what happened\n   - What you've already tried\n\n2. **Include context:**\n   - Framework/library versions\n   - Environment (browser, Node.js)\n   - Relevant configuration\n\n**Want More Specific Help?**\nTry asking with more details like:\n- "Why am I getting [specific error] in [technology]?"\n- "How to implement [feature] in [framework]?"\n- "What's the best way to [task] in [language]?"\n\nI'm here to help! Feel free to ask more specific questions.`;
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

      // Fallback to pattern-based response
      const fallbackResponse = generateIntelligentResponse(userQuery);
      const fullFallbackContent = `I couldn't connect to the AI service, but here's what I can tell you:\n\n${fallbackResponse}\n\n**Note:** This is a fallback response. For better answers, please ensure:\n1. Server is running\n2. Gemini API key is configured\n3. Network connection is stable`;

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
        title: "Using Fallback Response",
        description: error instanceof Error ? error.message : "Couldn't connect to AI service",
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
