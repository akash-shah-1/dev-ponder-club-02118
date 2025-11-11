import { useState } from "react";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import QuestionCard from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter } from "lucide-react";
import { AskQuestionModal } from "@/components/AskQuestionModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFilterPagination, FilterType } from "@/hooks/useFilterPagination";

interface Question {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  author: { name: string; reputation: number };
  stats: { views: number; answers: number; solved: boolean };
  timestamp: string;
  activity?: string;
}

const mockQuestions: Question[] = [
  {
    id: "1",
    title: "How to implement JWT authentication in React with proper token refresh?",
    excerpt: "I'm building a React app and need to implement JWT authentication with automatic token refresh. What's the best approach to handle expired tokens?",
    tags: ["react", "authentication", "jwt", "security"],
    author: {
      name: "Sarah Chen",
      reputation: 2450,
    },
    stats: {
      views: 234,
      answers: 5,
      solved: true,
    },
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    title: "TypeScript generic constraints not working as expected with React components",
    excerpt: "I'm trying to create a reusable React component with TypeScript generics but the constraints aren't being enforced properly...",
    tags: ["typescript", "react", "generics"],
    author: {
      name: "Alex Kumar",
      reputation: 1823,
    },
    stats: {
      views: 145,
      answers: 3,
      solved: false,
    },
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    title: "Best practices for handling async operations in Node.js with error handling",
    excerpt: "What are the recommended patterns for managing multiple async operations in Node.js while ensuring proper error handling and avoiding callback hell?",
    tags: ["node.js", "async", "error-handling", "javascript"],
    author: {
      name: "Marcus Johnson",
      reputation: 3120,
    },
    stats: {
      views: 389,
      answers: 8,
      solved: true,
    },
    timestamp: "1 day ago",
  },
  {
    id: "4",
    title: "React useState not updating immediately - understanding closure issues",
    excerpt: "I'm having trouble with useState where the state doesn't update immediately when I call the setter function. How does closure affect this?",
    tags: ["react", "hooks", "javascript", "closures"],
    author: {
      name: "Emma Rodriguez",
      reputation: 1654,
    },
    stats: {
      views: 567,
      answers: 12,
      solved: true,
    },
    timestamp: "2 days ago",
  },
];

const Questions = () => {
  const [showAskModal, setShowAskModal] = useState(false);
  const isMobile = useIsMobile();

  // Filter function for questions
  const filterQuestions = (question: Question, filter: FilterType): boolean => {
    switch (filter) {
      case "newest":
        return true; // Show all, sorted by newest
      case "active":
        return question.activity !== undefined;
      case "unanswered":
        return question.stats.answers === 0;
      case "solved":
        return question.stats.solved;
      default:
        return true;
    }
  };

  const {
    currentItems,
    currentPage,
    totalPages,
    currentFilter,
    setCurrentFilter,
    setCurrentPage,
    canGoNext,
    canGoPrevious,
  } = useFilterPagination({
    items: mockQuestions,
    itemsPerPage: 5,
    filterFn: filterQuestions,
  });

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-0">
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">All Questions</h1>
                <p className="text-muted-foreground mt-1">
                  Browse questions from the community
                </p>
              </div>
              <Button onClick={() => setShowAskModal(true)}>Ask Question</Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Tabs value={currentFilter} onValueChange={(v) => setCurrentFilter(v as FilterType)} className="w-auto">
                <TabsList>
                  <TabsTrigger value="newest">Newest</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
                  <TabsTrigger value="solved">Solved</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {currentItems.length > 0 ? (
                currentItems.map((question) => (
                  <QuestionCard key={question.id} {...question} />
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No questions found with the selected filter.
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!canGoPrevious}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant="outline"
                    size="sm"
                    className={currentPage === page ? "bg-primary text-primary-foreground" : ""}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!canGoNext}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <AskQuestionModal open={showAskModal} onOpenChange={setShowAskModal} />
      <MobileNav />
    </div>
  );
};

export default Questions;
