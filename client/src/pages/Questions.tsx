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
import { useQuestions } from "@/hooks/useQuestions";
import { Question as ApiQuestion } from "@/api/types";

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

// Helper function to transform API question to display format
const transformQuestion = (q: ApiQuestion): Question => ({
  id: q.id,
  title: q.title,
  excerpt: q.excerpt,
  tags: Array.isArray(q.tags)
    ? q.tags.map(tag => typeof tag === 'string' ? tag : tag.name)
    : [],
  author: {
    name: q.author?.name || 'Unknown',
    reputation: q.author?.reputation || 0,
  },
  stats: {
    views: q.views,
    answers: q.answerCount || 0,
    solved: q.solved,
  },
  timestamp: new Date(q.createdAt).toLocaleDateString(),
});

const Questions = () => {
  const [showAskModal, setShowAskModal] = useState(false);
  const isMobile = useIsMobile();
  const { data: apiQuestions, isLoading } = useQuestions();

  const questions = apiQuestions?.map(transformQuestion) || [];

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
    items: questions,
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
              <Button className="shrink-0" onClick={() => setShowAskModal(true)}>Ask Question</Button>
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
              {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Loading questions...
                </div>
              ) : currentItems.length > 0 ? (
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
