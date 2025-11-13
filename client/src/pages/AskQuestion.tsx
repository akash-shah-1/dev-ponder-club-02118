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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCreateQuestion } from "@/hooks/useQuestions";

const categories = [
  { value: 'frontend', label: 'Frontend Development' },
  { value: 'backend', label: 'Backend Development' },
  { value: 'devops', label: 'DevOps' },
  { value: 'database', label: 'Database' },
  { value: 'testing', label: 'Testing' },
  { value: 'mobile', label: 'Mobile Development' },
];

const AskQuestion = () => {
  const navigate = useNavigate();
  const createQuestion = useCreateQuestion();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<string>("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a question title.",
        variant: "destructive",
      });
      return;
    }

    if (title.trim().length < 10) {
      toast({
        title: "Title too short",
        description: "Title must be at least 10 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (title.trim().length > 200) {
      toast({
        title: "Title too long",
        description: "Title must be no more than 200 characters.",
        variant: "destructive",
      });
      return;
    }

    if (!body.trim()) {
      toast({
        title: "Description required",
        description: "Please provide question details.",
        variant: "destructive",
      });
      return;
    }

    if (body.trim().length < 30) {
      toast({
        title: "Description too short",
        description: "Description must be at least 30 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (!category) {
      toast({
        title: "Category required",
        description: "Please select a category.",
        variant: "destructive",
      });
      return;
    }

    if (tags.length === 0) {
      toast({
        title: "Tags required",
        description: "Please add at least one tag.",
        variant: "destructive",
      });
      return;
    }

    if (tags.length > 5) {
      toast({
        title: "Too many tags",
        description: "Maximum 5 tags allowed.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createQuestion.mutateAsync({
        title: title.trim(),
        description: body.trim(),
        category: category as any,
        tags,
      });
      
      navigate("/questions");
    } catch (error) {
      console.error('Failed to create question:', error);
    }
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
                    maxLength={200}
                  />
                  <p className="text-sm text-muted-foreground">
                    {title.length}/200 characters (minimum 10)
                  </p>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Choose the category that best fits your question
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
                    {body.length} characters (minimum 30)
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
                    {tags.length}/5 tags - Add up to 5 tags to describe what your question is about
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={createQuestion.isPending}>
                    {createQuestion.isPending ? "Posting..." : "Post Question"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate(-1)} disabled={createQuestion.isPending}>
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
