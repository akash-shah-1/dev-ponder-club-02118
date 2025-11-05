import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { BookOpen, Users, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockCollectives = [
  {
    id: 1,
    name: "React Developers",
    logo: "⚛️",
    members: "12.5K",
    articles: 234,
    tags: ["React", "JavaScript", "Frontend"],
    description: "Everything about React and modern frontend development",
    recognized: true,
  },
  {
    id: 2,
    name: "Python Community",
    logo: "🐍",
    members: "18.2K",
    articles: 456,
    tags: ["Python", "Django", "Machine Learning"],
    description: "Python enthusiasts sharing knowledge and best practices",
    recognized: true,
  },
  {
    id: 3,
    name: "DevOps Hub",
    logo: "⚙️",
    members: "9.8K",
    articles: 178,
    tags: ["DevOps", "CI/CD", "Cloud"],
    description: "DevOps practices, tools, and automation discussions",
    recognized: false,
  },
];

const Collectives = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold">Collectives</h1>
              </div>
              <Button>Create Collective</Button>
            </div>

            <p className="text-muted-foreground mb-6">
              Community-led groups where members share knowledge and connect around shared technologies
            </p>

            <div className="grid gap-4">
              {mockCollectives.map((collective) => (
                <Card key={collective.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">{collective.logo}</div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle>{collective.name}</CardTitle>
                            {collective.recognized && (
                              <Badge variant="default" className="gap-1">
                                <Award className="h-3 w-3" />
                                Recognized
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {collective.members} members
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {collective.articles} articles
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                      <Button>Join</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {collective.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {collective.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Collectives;
