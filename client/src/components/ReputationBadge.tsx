import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Star, Zap } from "lucide-react";

interface ReputationBadgeProps {
  reputation: number;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

const getReputationLevel = (rep: number) => {
  if (rep >= 10000) return { level: "Expert", icon: Award, color: "text-primary" };
  if (rep >= 5000) return { level: "Advanced", icon: Star, color: "text-accent" };
  if (rep >= 1000) return { level: "Intermediate", icon: Zap, color: "text-secondary" };
  return { level: "Beginner", icon: TrendingUp, color: "text-muted-foreground" };
};

const ReputationBadge = ({ reputation, showIcon = true, size = "md" }: ReputationBadgeProps) => {
  const { level, icon: Icon, color } = getReputationLevel(reputation);
  
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={`flex items-center gap-1.5 ${sizeClasses[size]}`}>
      {showIcon && <Icon className={`h-4 w-4 ${color}`} />}
      <span className="font-semibold">{reputation.toLocaleString()}</span>
      <Badge variant="outline" className="ml-1">
        {level}
      </Badge>
    </div>
  );
};

export default ReputationBadge;
