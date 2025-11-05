import { Search, BookOpen, TrendingUp, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const knowledgeArticles = [
  {
    id: 1,
    title: "Understanding React Hooks: A Deep Dive",
    category: "Frontend",
    views: 1234,
    lastUpdated: "2 days ago",
    tags: ["react", "hooks", "javascript"],
    excerpt: "A comprehensive guide to understanding and using React Hooks effectively in your applications.",
  },
  {
    id: 2,
    title: "Best Practices for API Error Handling",
    category: "Backend",
    views: 987,
    lastUpdated: "5 days ago",
    tags: ["api", "error-handling", "node.js"],
    excerpt: "Learn how to properly handle API errors and provide meaningful feedback to users.",
  },
  {
    id: 3,
    title: "Docker Container Optimization Strategies",
    category: "DevOps",
    views: 756,
    lastUpdated: "1 week ago",
    tags: ["docker", "devops", "optimization"],
    excerpt: "Techniques to reduce Docker image size and improve container performance.",
  },
  {
    id: 4,
    title: "TypeScript Generics Explained",
    category: "Frontend",
    views: 645,
    lastUpdated: "3 days ago",
    tags: ["typescript", "generics"],
    excerpt: "Master TypeScript generics to write more reusable and type-safe code.",
  },
  {
    id: 5,
    title: "Database Indexing Fundamentals",
    category: "Database",
    views: 543,
    lastUpdated: "4 days ago",
    tags: ["database", "performance", "sql"],
    excerpt: "Understanding when and how to use database indexes for optimal query performance.",
  },
];

const Knowledge = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Knowledge Base</h1>
              <p className="text-muted-foreground">
                Curated articles from resolved discussions - your team's collective wisdom
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search knowledge articles..."
                className="pl-9"
              />
            </div>

            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All Articles</TabsTrigger>
                <TabsTrigger value="frontend">Frontend</TabsTrigger>
                <TabsTrigger value="backend">Backend</TabsTrigger>
                <TabsTrigger value="devops">DevOps</TabsTrigger>
                <TabsTrigger value="database">Database</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {knowledgeArticles.map((article) => (
                  <Card key={article.id} className="hover:border-primary transition-smooth cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <Badge variant="outline">{article.category}</Badge>
                          </div>
                          <CardTitle className="text-xl">{article.title}</CardTitle>
                          <CardDescription>{article.excerpt}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {article.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            {article.views} views
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {article.lastUpdated}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="frontend" className="space-y-4">
                {knowledgeArticles.filter(a => a.category === "Frontend").map((article) => (
                  <Card key={article.id} className="hover:border-primary transition-smooth cursor-pointer">
                    <CardHeader>
                      <CardTitle className="text-xl">{article.title}</CardTitle>
                      <CardDescription>{article.excerpt}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Knowledge;
