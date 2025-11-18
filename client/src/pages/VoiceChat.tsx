import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Phone, PhoneOff, Volume2, Loader2 } from "lucide-react";
import Vapi from "@vapi-ai/web";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Voice AI Assistant</h1>
          <p className="text-slate-600">Talk to AI about your coding questions</p>
        </div>

        {/* Voice Control Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-6">
          <div className="flex flex-col items-center">
            {/* Status Indicator */}
            <div className="mb-6">
              {isLoading ? (
                <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center">
                  <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
                </div>
              ) : isCallActive ? (
                <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                  isSpeaking 
                    ? "bg-gradient-to-br from-green-400 to-green-600 animate-pulse" 
                    : "bg-gradient-to-br from-blue-400 to-blue-600"
                }`}>
                  {isSpeaking ? (
                    <Volume2 className="w-16 h-16 text-white" />
                  ) : (
                    <Mic className="w-16 h-16 text-white" />
                  )}
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center">
                  <MicOff className="w-16 h-16 text-slate-400" />
                </div>
              )}
            </div>

            {/* Status Text */}
            <div className="text-center mb-6">
              <p className="text-xl font-semibold text-slate-800 mb-1">
                {isLoading ? "Connecting..." : isCallActive ? (isSpeaking ? "AI is speaking..." : "Listening...") : "Ready to chat"}
              </p>
              <p className="text-sm text-slate-500">
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
                <Phone className="w-6 h-6" />
                <span className="font-semibold text-lg">Start Voice Chat</span>
              </button>
            ) : (
              <button
                onClick={endCall}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
              >
                <PhoneOff className="w-6 h-6" />
                <span className="font-semibold text-lg">End Call</span>
              </button>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
              {error}
            </div>
          )}
        </div>

        {/* Conversation History */}
        {messages.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Conversation</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    <p className="text-sm font-medium mb-1">
                      {message.role === "user" ? "You" : "AI Assistant"}
                    </p>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3">💡 Tips for best experience:</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Speak clearly and at a normal pace</li>
            <li>• Allow microphone access when prompted</li>
            <li>• Use headphones to avoid echo</li>
            <li>• Ask specific coding questions for better answers</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
