import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import * as party from "party-js";

interface AskQuestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  { value: 'frontend', label: 'Frontend Development' },
  { value: 'backend', label: 'Backend Development' },
  { value: 'devops', label: 'DevOps' },
  { value: 'database', label: 'Database' },
  { value: 'testing', label: 'Testing' },
  { value: 'mobile', label: 'Mobile Development' },
];

export const AskQuestionModal = ({ open, onOpenChange }: AskQuestionModalProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("");
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
    
    if (!title.trim() || !body.trim() || tags.length === 0 || !category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields, select a category, and add at least one tag.",
        variant: "destructive",
      });
      return;
    }

    const questions = JSON.parse(localStorage.getItem('questions') || '[]');
    const newQuestion = {
      id: Date.now().toString(),
      title,
      description: body,
      excerpt: body.substring(0, 150) + '...',
      tags,
      category,
      author: { name: 'You', avatar: '', reputation: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      upvotes: 0,
      solved: false,
      answers: [],
    };
    
    localStorage.setItem('questions', JSON.stringify([newQuestion, ...questions]));

    onOpenChange(false);

    // Small delay to ensure modal closes before confetti
    await new Promise(resolve => setTimeout(resolve, 100));

    // Trigger confetti effect
    party.confetti(document.body, {
      count: party.variation.range(60, 100),
      spread: party.variation.range(40, 70),
    });

    toast({
      title: "Question posted!",
      description: "Your question has been submitted successfully.",
    });
    
    setTitle("");
    setBody("");
    setCategory("");
    setTags([]);
    navigate("/questions");
  };

  const FormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Question Title</Label>
        <Input
          id="title"
          placeholder="e.g., How to implement JWT authentication in React?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

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
      </div>

      <div className="space-y-2">
        <Label htmlFor="body">Question Details</Label>
        <Textarea
          id="body"
          placeholder="Provide all the details someone would need to help you..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          className="resize-none"
        />
      </div>

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
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit">Post Question</Button>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Ask a Question</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 max-h-[80vh] overflow-y-auto">
            <FormContent />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ask a Question</DialogTitle>
        </DialogHeader>
        <FormContent />
      </DialogContent>
    </Dialog>
  );
};
