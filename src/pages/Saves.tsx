import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Bookmark, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionCard from "@/components/QuestionCard";
import { useQuestions } from "@/hooks/useQuestions";

const Saves = () => {
  const { data: questions = [], isLoading } = useQuestions();
  const savedQuestions = questions.slice(0, 5); // Mock saved questions

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Bookmark className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold">Saved Items</h1>
            </div>

            <Tabs defaultValue="questions" className="w-full">
              <TabsList>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="answers">Answers</TabsTrigger>
                <TabsTrigger value="tags">Tags</TabsTrigger>
              </TabsList>

              <TabsContent value="questions" className="mt-6 space-y-4">
                {isLoading ? (
                  <p className="text-muted-foreground">Loading saved questions...</p>
                ) : savedQuestions.length > 0 ? (
                  savedQuestions.map((question) => (
                    <QuestionCard
                      key={question.id}
                      id={question.id}
                      title={question.title}
                      excerpt={question.excerpt}
                      tags={question.tags}
                      author={question.author}
                      stats={{
                        views: question.views,
                        answers: question.answerCount || 0,
                        solved: false,
                      }}
                      timestamp={new Date(question.createdAt).toLocaleDateString()}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No saved questions yet</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="answers" className="mt-6">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No saved answers yet</p>
                </div>
              </TabsContent>

              <TabsContent value="tags" className="mt-6">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No saved tags yet</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default Saves;
