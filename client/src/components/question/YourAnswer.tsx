import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface YourAnswerProps {
  onWriteAnswer: () => void;
}

export const YourAnswer = ({ onWriteAnswer }: YourAnswerProps) => {
  return (
    <Card className="p-4 md:p-6">
      <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Your Answer</h3>
      <p className="text-muted-foreground text-xs md:text-sm mb-3 md:mb-4">
        Share your knowledge and help the community
      </p>
      <Button onClick={onWriteAnswer} size="sm">Write Answer</Button>
    </Card>
  );
};
