import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Search } from "lucide-react";
import { Link } from "react-router-dom";

interface SuggestedQuestion {
  id: string;
  title: string;
  tags: string[];
  relevance: number;
}

export const AIAssistant = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestedQuestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Simulate AI search
    setTimeout(() => {
      const mockSuggestions: SuggestedQuestion[] = [
        {
          id: '1',
          title: 'How to implement JWT authentication in React with proper token refresh?',
          tags: ['react', 'jwt', 'authentication'],
          relevance: 95
        },
        {
          id: '2',
          title: 'Best practices for React authentication patterns',
          tags: ['react', 'security', 'best-practices'],
          relevance: 88
        },
        {
          id: '3',
          title: 'TypeScript generic constraints with React components',
          tags: ['typescript', 'react', 'generics'],
          relevance: 82
        },
      ];
      
      setSuggestions(mockSuggestions);
      setIsSearching(false);
    }, 1000);
  };

  return (
    <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">AI Question Finder</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Describe your problem and I'll help you find relevant questions
      </p>
      
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="e.g., React authentication with JWT..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isSearching}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {isSearching && (
        <div className="text-center py-4 text-muted-foreground">
          <Sparkles className="h-6 w-6 animate-pulse mx-auto mb-2" />
          Searching...
        </div>
      )}

      {suggestions.length > 0 && !isSearching && (
        <div className="space-y-3">
          <div className="text-sm font-medium">Suggested Questions:</div>
          {suggestions.map((suggestion) => (
            <Link key={suggestion.id} to={`/questions/${suggestion.id}`}>
              <div className="p-3 rounded-lg bg-card hover:bg-accent/10 transition-colors border border-border">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-sm font-medium flex-1">{suggestion.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {suggestion.relevance}% match
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {suggestion.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
};
