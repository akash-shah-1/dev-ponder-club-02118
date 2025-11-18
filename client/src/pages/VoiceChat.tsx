import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Phone, PhoneOff, Volume2, Loader2 } from "lucide-react";
import Vapi from "@vapi-ai/web";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function VoiceChat() {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const vapiInstance = new Vapi(import.meta.env.VITE_VAPI_PUBLIC_KEY);
    setVapi(vapiInstance);

    vapiInstance.on("call-start", () => {
      setIsCallActive(true);
      setIsLoading(false);
      setError(null);
    });

    vapiInstance.on("call-end", () => {
      setIsCallActive(false);
      setIsSpeaking(false);
      setIsLoading(false);
    });

    vapiInstance.on("speech-start", () => {
      setIsSpeaking(true);
    });

    vapiInstance.on("speech-end", () => {
      setIsSpeaking(false);
    });

    vapiInstance.on("message", (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage: Message = {
          role: message.role,
          content: message.transcript,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    vapiInstance.on("error", (error: any) => {
      console.error("Vapi error:", error);
      setError("Voice connection error. Please try again.");
      setIsLoading(false);
    });

    return () => {
      vapiInstance.stop();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (conversationRef.current) {
        const scrollTop = conversationRef.current.scrollTop;
        const opacity = Math.max(0.3, 1 - scrollTop / 200);
        setScrollOpacity(opacity);
      }
    };

    const conversationEl = conversationRef.current;
    if (conversationEl) {
      conversationEl.addEventListener("scroll", handleScroll);
      return () => conversationEl.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const startCall = async () => {
    if (!vapi) return;
    
    setIsLoading(true);
    setError(null);

    try {
      await vapi.start({
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en-US",
        },
        model: {
          provider: "openai",
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a helpful coding assistant. Answer programming questions clearly and concisely. Keep responses under 100 words unless more detail is requested.",
            },
          ],
        },
        voice: {
          provider: "11labs",
          voiceId: "21m00Tcm4TlvDq8ikWAM",
        },
      });
    } catch (err: any) {
      console.error("Failed to start call:", err);
      setError("Failed to start voice chat. Check your microphone permissions.");
      setIsLoading(false);
    }
  };

  const endCall = () => {
    if (vapi) {
      vapi.stop();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-6 lg:mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Voice AI Assistant</h1>
              <p className="text-muted-foreground">Talk to AI about your coding questions</p>
            </div>

            {/* Main Layout - Split on Desktop, Stacked on Mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Left Side - Assistant Control (Hidden on Mobile) */}
              <div className="hidden lg:block space-y-6">
                {/* Voice Control Card */}
                <div className="bg-card rounded-2xl shadow-lg border border-border p-6 lg:p-8 lg:sticky lg:top-6">
                  <div className="flex flex-col items-center">
                    {/* Status Indicator */}
                    <div className="mb-6">
                      {isLoading ? (
                        <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-primary/10 flex items-center justify-center">
                          <Loader2 className="w-16 h-16 lg:w-20 lg:h-20 text-primary animate-spin" />
                        </div>
                      ) : isCallActive ? (
                        <div className={`w-32 h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center transition-all ${
                          isSpeaking 
                            ? "bg-gradient-to-br from-green-400 to-green-600 animate-pulse shadow-lg shadow-green-500/50" 
                            : "bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/50"
                        }`}>
                          {isSpeaking ? (
                            <Volume2 className="w-16 h-16 lg:w-20 lg:h-20 text-white" />
                          ) : (
                            <Mic className="w-16 h-16 lg:w-20 lg:h-20 text-white" />
                          )}
                        </div>
                      ) : (
                        <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-muted flex items-center justify-center">
                          <MicOff className="w-16 h-16 lg:w-20 lg:h-20 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Status Text */}
                    <div className="text-center mb-6">
                      <p className="text-xl lg:text-2xl font-semibold text-foreground mb-1">
                        {isLoading ? "Connecting..." : isCallActive ? (isSpeaking ? "AI is speaking..." : "Listening...") : "Ready to chat"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isCallActive ? "Speak naturally, AI will respond" : "Click the button below to start"}
                      </p>
                    </div>

                    {/* Control Button */}
                    {!isCallActive ? (
                      <button
                        onClick={startCall}
                        disabled={isLoading}
                        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                      >
                        <Phone className="w-5 h-5 lg:w-6 lg:h-6" />
                        <span className="font-semibold text-base lg:text-lg">Start Voice Chat</span>
                      </button>
                    ) : (
                      <button
                        onClick={endCall}
                        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
                      >
                        <PhoneOff className="w-5 h-5 lg:w-6 lg:h-6" />
                        <span className="font-semibold text-base lg:text-lg">End Call</span>
                      </button>
                    )}
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-center text-sm">
                      {error}
                    </div>
                  )}
                </div>

                {/* Tips - Hidden on Mobile when conversation exists */}
                <div className={`bg-primary/5 border border-primary/20 rounded-xl p-6 ${messages.length > 0 ? 'hidden lg:block' : ''}`}>
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <span className="text-xl">💡</span>
                    Tips for best experience
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Speak clearly and at a normal pace</li>
                    <li>• Allow microphone access when prompted</li>
                    <li>• Use headphones to avoid echo</li>
                    <li>• Ask specific coding questions for better answers</li>
                  </ul>
                </div>
              </div>

              {/* Right Side - Conversation History */}
              <div className="h-[calc(100vh-16rem)] lg:h-[calc(100vh-22rem)]">
                {messages.length > 0 ? (
                  <div className="bg-card rounded-2xl shadow-lg border border-border h-full flex flex-col">
                    <div className="p-4 lg:p-6 border-b border-border">
                      <h2 className="text-xl lg:text-2xl font-bold text-foreground">Conversation</h2>
                    </div>
                    <div 
                      ref={conversationRef}
                      className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 relative"
                    >
                      {/* Fade overlay for mobile */}
                      <div 
                        className="lg:hidden absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-card to-transparent pointer-events-none z-10 transition-opacity duration-300"
                        style={{ opacity: scrollOpacity }}
                      />
                      
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                        >
                          <div
                            className={`max-w-[85%] lg:max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-foreground"
                            }`}
                          >
                            <p className="text-xs font-medium mb-1 opacity-70">
                              {message.role === "user" ? "You" : "AI Assistant"}
                            </p>
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p className="text-xs opacity-60 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                ) : (
                  <div className="hidden lg:flex bg-card rounded-2xl shadow-lg border border-border h-full items-center justify-center p-8">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageSquare className="w-12 h-12 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">No conversation yet</h3>
                      <p className="text-muted-foreground">Start a voice chat to see your conversation here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <MobileNav 
        onVoiceClick={isCallActive ? endCall : startCall}
        isVoiceActive={isCallActive && isSpeaking}
        isLoading={isLoading}
      />
    </div>
  );
}

// Voice Sync Animation Component
function VoiceSyncAnimation() {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      {/* Outer pulse rings */}
      <div className="absolute inset-0 rounded-full bg-green-500/30 animate-ping" />
      <div className="absolute inset-0 rounded-full bg-green-500/20 animate-pulse" />
      
      {/* Main circle with bars */}
      <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center gap-1 shadow-lg shadow-green-500/50">
        {/* Animated sound bars */}
        <div className="flex items-center gap-0.5 h-8">
          <div className="w-1 bg-white rounded-full animate-voice-bar-1" style={{ height: '40%' }} />
          <div className="w-1 bg-white rounded-full animate-voice-bar-2" style={{ height: '60%' }} />
          <div className="w-1 bg-white rounded-full animate-voice-bar-3" style={{ height: '80%' }} />
          <div className="w-1 bg-white rounded-full animate-voice-bar-2" style={{ height: '60%' }} />
          <div className="w-1 bg-white rounded-full animate-voice-bar-1" style={{ height: '40%' }} />
        </div>
      </div>
    </div>
  );
}

function MessageSquare({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
