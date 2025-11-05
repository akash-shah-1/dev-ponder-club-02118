import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Questions from "./pages/Questions";
import AskQuestion from "./pages/AskQuestion";
import QuestionDetail from "./pages/QuestionDetail";
import Tags from "./pages/Tags";
import Users from "./pages/Users";
import Knowledge from "./pages/Knowledge";
import Leaderboard from "./pages/Leaderboard";
import Saves from "./pages/Saves";
import Companies from "./pages/Companies";
import Discussions from "./pages/Discussions";
import Collectives from "./pages/Collectives";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Help from "./pages/Help";
import { AIChatbot } from "./components/AIChatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/questions/:id" element={<QuestionDetail />} />
          <Route path="/ask" element={<AskQuestion />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/users" element={<Users />} />
          <Route path="/saves" element={<Saves />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/discussions" element={<Discussions />} />
          <Route path="/collectives" element={<Collectives />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/help" element={<Help />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <AIChatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
