import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, MessageSquare, MessageCircle, BookOpen, Mic, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  onVoiceClick?: () => void;
  isVoiceActive?: boolean;
  isLoading?: boolean;
}

export const MobileNav = ({ onVoiceClick, isVoiceActive = false, isLoading = false }: MobileNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isVoiceChatPage = location.pathname === "/voice-chat";

  const leftNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: MessageSquare, label: "Questions", path: "/questions" },
  ];

  const rightNavItems = [
    { icon: MessageCircle, label: "Discussions", path: "/discussions" },
    { icon: BookOpen, label: "Collectives", path: "/collectives" },
  ];

  const handleVoiceClick = () => {
    if (isVoiceChatPage && onVoiceClick) {
      // If on voice chat page and handler provided, trigger the call
      onVoiceClick();
    } else {
      // Otherwise navigate to voice chat page
      navigate("/voice-chat");
    }
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        {/* Curved background with cutout */}
        <div className="relative">
          {/* Main navigation bar */}
          <div className="bg-card border-t border-border shadow-lg">
            <div className="flex justify-between items-center h-16 px-2">
              {/* Left items */}
              <div className="flex flex-1 justify-around">
                {leftNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-colors",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs mt-1">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Center spacer for floating button */}
              <div className="w-20" />

              {/* Right items */}
              <div className="flex flex-1 justify-around">
                {rightNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-colors",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-xs mt-1">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Floating center button */}
          <button
            onClick={handleVoiceClick}
            disabled={isLoading}
            className={cn(
              "absolute left-1/2 -translate-x-1/2 transition-all duration-300 ease-out disabled:cursor-not-allowed",
              isVoiceChatPage 
                ? "-top-8 scale-110" 
                : "-top-6 scale-100"
            )}
          >
            <div className="relative">
              {/* Animated rings when loading or active */}
              {isLoading && (
                <>
                  <div className="absolute -inset-2 rounded-full bg-blue-500/20 animate-ping" style={{ animationDuration: '1.5s' }} />
                  <div className="absolute -inset-4 rounded-full bg-blue-500/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
                </>
              )}
              {isVoiceActive && (
                <>
                  <div className="absolute -inset-2 rounded-full bg-green-500/30 animate-ping" style={{ animationDuration: '1s' }} />
                  <div className="absolute -inset-4 rounded-full bg-green-500/20 animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.3s' }} />
                  <div className="absolute -inset-6 rounded-full bg-green-500/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.6s' }} />
                </>
              )}
              
              {/* Glow effect when on voice chat page */}
              {isVoiceChatPage && !isLoading && !isVoiceActive && (
                <>
                  <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-pulse" />
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                </>
              )}
              
              {/* Main button */}
              <div className={cn(
                "relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500",
                isLoading
                  ? "bg-gradient-to-br from-blue-400 to-blue-500 shadow-blue-500/50"
                  : isVoiceActive
                  ? "bg-gradient-to-br from-green-400 to-green-600 shadow-green-500/50"
                  : isVoiceChatPage
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/50"
                  : "bg-gradient-to-br from-primary to-primary/80 shadow-primary/30"
              )}>
                {/* Loading animation - smooth rotating dots */}
                {isLoading ? (
                  <div className="relative w-10 h-10">
                    {/* Rotating dots */}
                    <div className="absolute inset-0 animate-spin">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full" />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-white/60 rounded-full" />
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white/40 rounded-full" />
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white/80 rounded-full" />
                    </div>
                    {/* Center pulse */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    </div>
                  </div>
                ) : isVoiceActive ? (
                  /* Voice animation bars when active */
                  <div className="flex items-center gap-0.5 h-6">
                    <div className="w-1 bg-white rounded-full animate-voice-bar-1" style={{ height: '40%' }} />
                    <div className="w-1 bg-white rounded-full animate-voice-bar-2" style={{ height: '60%' }} />
                    <div className="w-1 bg-white rounded-full animate-voice-bar-3" style={{ height: '80%' }} />
                    <div className="w-1 bg-white rounded-full animate-voice-bar-2" style={{ height: '60%' }} />
                    <div className="w-1 bg-white rounded-full animate-voice-bar-1" style={{ height: '40%' }} />
                  </div>
                ) : (
                  <Mic className={cn(
                    "w-7 h-7 text-white transition-transform duration-300",
                    isVoiceChatPage && "scale-110"
                  )} />
                )}
                
                {/* Ready indicator dot */}
                {!isLoading && !isVoiceActive && isVoiceChatPage && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-white" />
                )}
              </div>

              {/* Label below button */}
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className={cn(
                  "text-xs font-medium transition-colors",
                  isLoading 
                    ? "text-blue-500 animate-pulse"
                    : isVoiceActive
                    ? "text-green-500"
                    : isVoiceChatPage 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}>
                  {isLoading ? "Connecting..." : isVoiceActive ? "Speaking..." : "Voice AI"}
                </span>
              </div>
            </div>
          </button>
        </div>
      </nav>

      {/* Spacer for bottom nav */}
      <div className="md:hidden h-16" />
    </>
  );
};
