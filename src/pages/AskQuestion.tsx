import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AskQuestion = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 5 && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !body.trim() || tags.length === 0) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields and add at least one tag.",
        variant: "destructive",
      });
      return;
    }

    // Mock submission - would connect to your backend
    toast({
      title: "Question posted!",
      description: "Your question has been submitted successfully.",
    });
    
    navigate("/questions");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Ask a Question</h1>
              <p className="text-muted-foreground mt-1">
                Get help from the community by asking a detailed question
              </p>
            </div>

            <Card className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Question Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., How to implement JWT authentication in React?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Be specific and imagine you're asking a question to another person
                  </p>
                </div>

                {/* Body */}
                <div className="space-y-2">
                  <Label htmlFor="body">Question Details</Label>
                  <Textarea
                    id="body"
                    placeholder="Provide all the details someone would need to help you..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={10}
                    className="resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    Include code snippets, error messages, and what you've already tried
                  </p>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      placeholder="Add a tag (max 5)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add up to 5 tags to describe what your question is about
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <Button type="submit">Post Question</Button>
                  <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AskQuestion;
