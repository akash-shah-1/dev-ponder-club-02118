import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Questions from "./Questions";
import AskQuestion from "./AskQuestion";
import QuestionDetail from "./QuestionDetail";
import Leaderboard from "./Leaderboard";
import Saves from "./Saves";
import Discussions from "./Discussions";
import Collectives from "./Collectives";
import DiscussionDetail from "./DiscussionDetail";
import CollectiveDetail from "./CollectiveDetail";
import Profile from "./Profile";
import NotFound from "./NotFound";
import Help from "./Help";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Terms from "./Terms";
import Privacy from "./Privacy";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AdminRoutes from "../admin/AdminRoutes";
import VoiceChat from "./VoiceChat";

export const AppRoutes = () => (
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
        <Route path="/voice-chat" element={<ProtectedRoute><VoiceChat /></ProtectedRoute>} />
        <Route path="/help" element={<Help />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element="/signup" />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="*" element={<NotFound />} />
    </Routes>
);
