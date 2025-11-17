import { Badge } from "@/components/ui/badge";
import { AuthorInfo } from "@/components/AuthorInfo";

interface QuestionBodyProps {
  description: string;
  tags: { name: string }[] | string[];
  author: {
    name: string;
    avatar: string;
    reputation: number;
  };
}

export const QuestionBody = ({ description, tags, author }: QuestionBodyProps) => {
  return (
    <div className="flex-1 space-y-3 md:space-y-4 min-w-0">
      <div className="prose max-w-none">
        <pre className="whitespace-pre-wrap font-sans text-xs md:text-sm overflow-x-auto">{description}</pre>
      </div>

      <div className="flex flex-wrap gap-1.5 md:gap-2">
        {tags.map((tag) => {
          const tagName = typeof tag === 'string' ? tag : tag.name;
          return (
            <Badge key={tagName} variant="secondary" className="text-xs">
              {tagName}
            </Badge>
          );
        })}
      </div>

      <div className="pt-3 md:pt-4">
        <AuthorInfo
          name={author.name}
          avatar={author.avatar}
          reputation={author.reputation}
          avatarSize="lg"
        />
      </div>
    </div>
  );
};
