import React, { useState, useEffect, useRef } from "react";
import { Send, Bot, User, AlertCircle } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [sqlPassword, setSqlPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [mode, setMode] = useState<"chat" | "sql">("chat"); // New: mode selector
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check if query requires password (DELETE, UPDATE, DROP, ALTER, INSERT)
  const requiresPassword = (query: string): boolean => {
    const dangerousKeywords = /\b(delete|update|drop|alter|insert|truncate|create)\b/i;
    return dangerousKeywords.test(query);
  };

  useEffect(() => {
    setShowPassword(mode === "sql" && requiresPassword(input));
  }, [input, mode]);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const needsPassword = mode === "sql" && requiresPassword(input);
    if (needsPassword && !sqlPassword) {
      setError("Password required for this operation (DELETE/UPDATE/INSERT)");
      return;
    }

    const newUserMessage: Message = { 
      id: Date.now(), 
      text: input, 
      sender: "user",
      timestamp: new Date()
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    const currentInput = input;
    setInput("");
    setSqlPassword("");
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('admin_access_token');
    if (!token) {
      setError("Admin not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const endpoint = mode === "chat" ? "/admin-ai/chat" : "/admin-ai/run-sql";
      const body = mode === "chat" 
        ? { prompt: currentInput }
        : { prompt: currentInput, password: needsPassword ? sqlPassword : undefined };

      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API request failed');
      }

      const data = await response.json();
      const aiResponseText = typeof data.data === 'string' 
        ? data.data 
        : JSON.stringify(data.data, null, 2);

      const newAiMessage: Message = { 
        id: Date.now() + 1, 
        text: aiResponseText, 
        sender: "ai",
        timestamp: new Date()
      };
      setMessages((prevMessages) => [...prevMessages, newAiMessage]);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: `Error: ${err.message || "An unknown error occurred."}`,
        sender: "ai",
        timestamp: new Date()
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">AI Assistant</h1>
              <p className="text-sm text-slate-500">
                {mode === "chat" ? "Chat with AI about anything" : "Query your database in natural language"}
              </p>
            </div>
          </div>
          
          {/* Mode Selector */}
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setMode("chat")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                mode === "chat"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              💬 Chat
            </button>
            <button
              onClick={() => setMode("sql")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                mode === "sql"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              🗄️ Database
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="w-16 h-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">Start a conversation</h3>
            <p className="text-slate-500 max-w-md">
              Ask me anything about your database. I can help you query, analyze, and understand your data.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-left">
                <p className="text-sm text-slate-600">💡 "Show me all users"</p>
              </div>
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-left">
                <p className="text-sm text-slate-600">💡 "Count questions by category"</p>
              </div>
            </div>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.sender === "ai" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                message.sender === "user"
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md"
                  : "bg-white text-slate-800 shadow-sm border border-slate-200"
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans text-sm">{message.text}</pre>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
            {message.sender === "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-200">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-6 mb-2 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 px-6 py-4 shadow-lg">
        {showPassword && (
          <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">Password Required</span>
            </div>
            <input
              type="password"
              className="w-full border border-amber-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Enter admin password for this operation"
              value={sqlPassword}
              onChange={(e) => setSqlPassword(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-amber-600 mt-1">
              This query contains DELETE/UPDATE/INSERT operations
            </p>
          </div>
        )}
        
        <div className="flex gap-3">
          <input
            type="text"
            className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type your question here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !loading) {
                sendMessage();
              }
            }}
            disabled={loading}
          />
          <button
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            <Send className="w-4 h-4" />
            <span className="font-medium">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
