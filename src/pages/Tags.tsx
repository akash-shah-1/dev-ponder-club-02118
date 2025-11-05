import { Search } from "lucide-react";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tags = [
  { name: "javascript", count: 234, description: "For questions about JavaScript programming" },
  { name: "react", count: 189, description: "Questions related to React library and ecosystem" },
  { name: "typescript", count: 156, description: "TypeScript language and type systems" },
  { name: "node.js", count: 145, description: "Server-side JavaScript runtime" },
  { name: "python", count: 134, description: "General Python programming questions" },
  { name: "css", count: 98, description: "Styling and CSS-related questions" },
  { name: "api", count: 87, description: "API design and integration" },
  { name: "database", count: 76, description: "Database design and queries" },
  { name: "docker", count: 65, description: "Containerization and Docker" },
  { name: "git", count: 54, description: "Version control with Git" },
  { name: "testing", count: 48, description: "Testing strategies and frameworks" },
  { name: "devops", count: 43, description: "DevOps practices and tools" },
];

const Tags = () => {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Tags</h1>
              <p className="text-muted-foreground">
                Browse questions by topic to find what you're looking for
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tags..."
                className="pl-9"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tags.map((tag) => (
                <Card key={tag.name} className="hover:border-primary transition-smooth cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-base px-3 py-1">
                        #{tag.name}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {tag.count} questions
                      </span>
                    </div>
                    <CardDescription className="mt-2">
                      {tag.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default Tags;
