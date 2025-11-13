import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClerkProvider } from '@clerk/clerk-react';
import Home from "./pages/Home";
import Questions from "./pages/Questions";
import AskQuestion from "./pages/AskQuestion";
import QuestionDetail from "./pages/QuestionDetail";
import Leaderboard from "./pages/Leaderboard";
import Saves from "./pages/Saves";
import Discussions from "./pages/Discussions";
import Collectives from "./pages/Collectives";
import DiscussionDetail from "./pages/DiscussionDetail";
import CollectiveDetail from "./pages/CollectiveDetail";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Help from "./pages/Help";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import { AIChatbot } from "./components/AIChatbot";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthInitializer } from "./components/AuthInitializer";

const queryClient = new QueryClient();

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Clerk Publishable Key");
}

const App = () => (
  <ClerkProvider publishableKey={clerkPubKey}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthInitializer>
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/questions" element={<Questions />} />
              <Route path="/questions/:id" element={<QuestionDetail />} />
              <Route path="/ask" element={<ProtectedRoute><AskQuestion /></ProtectedRoute>} />
              <Route path="/saves" element={<ProtectedRoute><Saves /></ProtectedRoute>} />
              <Route path="/discussions" element={<Discussions />} />
              <Route path="/discussions/:id" element={<DiscussionDetail />} />
              <Route path="/collectives" element={<Collectives />} />
              <Route path="/collectives/:id" element={<CollectiveDetail />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/help" element={<Help />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <AIChatbot />
            </AuthInitializer>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ClerkProvider>
);

export default App;
