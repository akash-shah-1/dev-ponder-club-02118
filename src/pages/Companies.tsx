import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { Building2, Users, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockCompanies = [
  {
    id: 1,
    name: "TechCorp Solutions",
    logo: "🏢",
    location: "San Francisco, CA",
    employees: "1,000-5,000",
    tags: ["JavaScript", "React", "Node.js"],
    description: "Leading technology solutions provider",
  },
  {
    id: 2,
    name: "DataFlow Inc",
    logo: "📊",
    location: "New York, NY",
    employees: "500-1,000",
    tags: ["Python", "Machine Learning", "Data Science"],
    description: "Data analytics and AI solutions",
  },
  {
    id: 3,
    name: "CloudNine Systems",
    logo: "☁️",
    location: "Seattle, WA",
    employees: "5,000+",
    tags: ["AWS", "DevOps", "Kubernetes"],
    description: "Cloud infrastructure specialists",
  },
];

const Companies = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold">Companies</h1>
              </div>
              <Button>Add Company</Button>
            </div>

            <p className="text-muted-foreground mb-6">
              Discover companies hiring developers and explore their tech stacks
            </p>

            <div className="grid gap-4">
              {mockCompanies.map((company) => (
                <Card key={company.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{company.logo}</div>
                        <div>
                          <CardTitle>{company.name}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {company.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {company.employees}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                      <Button variant="outline">Follow</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {company.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {company.tags.map((tag) => (
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

export default Companies;
