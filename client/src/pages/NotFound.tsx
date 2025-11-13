import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/30 overflow-hidden relative">
      {/* Animated floating code symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl opacity-10 animate-float" style={{ animationDelay: "0s" }}>{"{"}</div>
        <div className="absolute top-40 right-20 text-5xl opacity-10 animate-float" style={{ animationDelay: "0.5s" }}>{"</>"}</div>
        <div className="absolute bottom-32 left-1/4 text-7xl opacity-10 animate-float" style={{ animationDelay: "1s" }}>{"[]"}</div>
        <div className="absolute top-1/3 right-1/4 text-6xl opacity-10 animate-float" style={{ animationDelay: "1.5s" }}>{"()"}</div>
        <div className="absolute bottom-20 right-10 text-5xl opacity-10 animate-float" style={{ animationDelay: "2s" }}>{";"}</div>
      </div>

      <div className="text-center z-10 px-4">
        {/* Animated 404 number */}
        <div className="mb-8 relative">
          <h1 className="text-9xl md:text-[200px] font-bold text-primary animate-bounce-slow">
            404
          </h1>
          <div className="absolute inset-0 text-9xl md:text-[200px] font-bold text-primary/20 blur-2xl animate-pulse">
            404
          </div>
        </div>

        {/* Developer character emoji with animation */}
        <div className="mb-6 animate-wiggle">
          <div className="text-8xl md:text-9xl inline-block">
            👨‍💻
          </div>
        </div>

        {/* Error messages */}
        <div className="space-y-4 mb-8 animate-fade-in">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground">
            Oops! Page Not Found
          </h2>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 max-w-md mx-auto">
            <code className="text-destructive font-mono text-sm">
              Error: Cannot GET {location.pathname}
            </code>
          </div>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Looks like this page took a coffee break and never came back. 
            Let's get you back to coding!
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="animate-scale-in">
            <Link to="/">
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="animate-scale-in" style={{ animationDelay: "0.1s" }}>
            <Link to="/questions">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Browse Questions
            </Link>
          </Button>
        </div>

        {/* Fun fact */}
        <div className="mt-12 text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: "0.3s" }}>
          💡 Fun fact: HTTP 404 was named after room 404 at CERN where the web was born!
        </div>
      </div>
    </div>
  );
};

export default NotFound;
