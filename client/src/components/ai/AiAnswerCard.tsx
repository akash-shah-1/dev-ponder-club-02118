import { Card } from '@/components/ui/card';
import { AiAnswerBadge } from './AiAnswerBadge';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AiAnswerCardProps {
  content: string;
  model?: string;
  confidence?: number;
  children?: React.ReactNode;
}

export function AiAnswerCard({ content, model, confidence, children }: AiAnswerCardProps) {
  return (
    <Card className="p-6 border-purple-100 bg-gradient-to-br from-purple-50/30 to-transparent">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-lg">🤖</span>
          </div>
          <div>
            <p className="font-semibold text-sm">AI Assistant</p>
            <AiAnswerBadge model={model} confidence={confidence} />
          </div>
        </div>
      </div>

      <Alert className="mb-4 border-amber-200 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 text-sm">
          AI-generated content may not be accurate. Please verify the solution works for your specific context.
        </AlertDescription>
      </Alert>

      <div className="prose prose-sm max-w-none">
        {children}
      </div>
    </Card>
  );
}
