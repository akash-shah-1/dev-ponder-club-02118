import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Eye, CheckCircle2, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { QuestionDetailDrawer } from "./QuestionDetailDrawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface QuestionCardProps {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
    reputation: number;
  };
  stats: {
    views: number;
    answers: number;
    solved: boolean;
  };
  timestamp: string;
}

const QuestionCard = ({ id, title, excerpt, tags, author, stats, timestamp }: QuestionCardProps) => {
  const isMobile = useIsMobile();
  const [showDrawer, setShowDrawer] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault();
      setShowDrawer(true);
    }
  };

  return (
    <>
      <Card className="p-3 md:p-6 hover:shadow-md transition-smooth border-l-4 border-l-transparent hover:border-l-primary">
        <Link to={`/questions/${id}`} onClick={handleClick} className="space-y-3 md:space-y-4 block">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 md:gap-4">
          <div className="flex-1 space-y-1.5 md:space-y-2">
            <div className="flex items-center gap-2">
              {stats.solved && (
                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-accent flex-shrink-0" />
              )}
              <h3 className="text-sm md:text-lg font-semibold hover:text-primary transition-smooth line-clamp-2">
                {title}
              </h3>
            </div>
            <p className="text-muted-foreground text-xs md:text-sm line-clamp-2">
              {excerpt}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 md:gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-smooth cursor-pointer text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 md:pt-4 border-t gap-2">
          <div className="flex items-center gap-2 md:gap-4">
            <Avatar className="h-6 w-6 md:h-8 md:w-8">
              <AvatarImage src={author.avatar} />
              <AvatarFallback>{author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="text-xs md:text-sm">
              <div className="font-medium">{author.name}</div>
              <div className="text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-2.5 w-2.5 md:h-3 md:w-3" />
                {author.reputation} rep
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3 md:h-4 md:w-4" />
              {stats.views}
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3 md:h-4 md:w-4" />
              {stats.answers}
            </div>
            <div className="hidden sm:block">{timestamp}</div>
          </div>
        </div>
      </Link>
    </Card>

    {isMobile && (
      <QuestionDetailDrawer
        open={showDrawer}
        onOpenChange={setShowDrawer}
        questionId={id}
      />
    )}
    </>
  );
};

export default QuestionCard;
