import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface AnswerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questionId: string;
  onAnswerSubmitted: () => void;
}

export const AnswerModal = ({ open, onOpenChange, questionId, onAnswerSubmitted }: AnswerModalProps) => {
  const isMobile = useIsMobile();
  const [answerText, setAnswerText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!answerText.trim()) {
      toast({
        title: "Empty answer",
        description: "Please write your answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    const answers = JSON.parse(localStorage.getItem(`answers_${questionId}`) || '[]');
    const newAnswer = {
      id: Date.now().toString(),
      questionId,
      body: answerText,
      author: { name: 'You', avatar: '', reputation: 0 },
      upvotes: 0,
      timestamp: 'Just now',
      isAccepted: false,
    };
    
    localStorage.setItem(`answers_${questionId}`, JSON.stringify([...answers, newAnswer]));

    toast({
      title: "Answer posted!",
      description: "Your answer has been submitted.",
    });
    
    setAnswerText("");
    onOpenChange(false);
    onAnswerSubmitted();
  };

  const FormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="answer">Your Answer</Label>
        <Textarea
          id="answer"
          placeholder="Write your answer here... Include code examples and explanations."
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          rows={12}
          className="resize-none font-mono text-sm"
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit">Post Answer</Button>
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
            <DrawerTitle>Write Your Answer</DrawerTitle>
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
          <DialogTitle>Write Your Answer</DialogTitle>
        </DialogHeader>
        <FormContent />
      </DialogContent>
    </Dialog>
  );
};
