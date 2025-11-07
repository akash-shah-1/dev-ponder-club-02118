import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAvatarUrl } from "@/lib/avatar";

interface AuthorInfoProps {
  name: string;
  avatar?: string;
  reputation: number;
  timestamp?: string;
  className?: string;
  avatarSize?: 'sm' | 'md' | 'lg';
}

export const AuthorInfo = ({
  name,
  avatar,
  reputation,
  timestamp,
  className,
  avatarSize = 'md',
}: AuthorInfoProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6 md:h-7 md:w-7',
    md: 'h-7 w-7 md:h-8 md:w-8',
    lg: 'h-8 w-8 md:h-10 md:w-10',
  };

  return (
    <div className={cn("flex items-center gap-2 md:gap-3", className)}>
      <Avatar className={sizeClasses[avatarSize]}>
        <AvatarImage src={avatar || getAvatarUrl(name)} alt={name} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="text-xs md:text-sm font-medium truncate">{name}</div>
        <div className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1">
          <TrendingUp className="h-2.5 w-2.5 md:h-3 md:w-3 flex-shrink-0" />
          <span>{reputation} rep</span>
          {timestamp && <span className="hidden sm:inline">• {timestamp}</span>}
        </div>
      </div>
    </div>
  );
};
