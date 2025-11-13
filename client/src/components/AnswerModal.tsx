import { useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCreateAnswer } from "@/hooks/useAnswers";

interface AnswerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questionId: string;
  onAnswerSubmitted: () => void;
}

export const AnswerModal = ({ open, onOpenChange, questionId, onAnswerSubmitted }: AnswerModalProps) => {
  const isMobile = useIsMobile();
  const createAnswer = useCreateAnswer();
  const [answerText, setAnswerText] = useState("");

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerText(e.target.value);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!answerText.trim()) {
      toast({
        title: "Empty answer",
        description: "Please write your answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (answerText.trim().length < 30) {
      toast({
        title: "Answer too short",
        description: "Answer must be at least 30 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createAnswer.mutateAsync({
        content: answerText.trim(),
        questionId,
      });
      
      setAnswerText("");
      onOpenChange(false);
      onAnswerSubmitted();
    } catch (error) {
      console.error('Failed to post answer:', error);
    }
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="answer">Your Answer</Label>
        <Textarea
          id="answer"
          placeholder="Write your answer here... Include code examples and explanations."
          value={answerText}
          onChange={handleTextChange}
          rows={12}
          className="resize-none font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">
          {answerText.length} characters (minimum 30)
        </p>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={createAnswer.isPending}>
          {createAnswer.isPending ? "Posting..." : "Post Answer"}
        </Button>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={createAnswer.isPending}>
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
            <DrawerTitle>Write Your Answer</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-4 max-h-[80vh] overflow-y-auto">
            {formContent}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Write Your Answer</DialogTitle>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};
