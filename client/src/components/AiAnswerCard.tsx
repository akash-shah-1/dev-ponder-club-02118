import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles, Bot, ChevronDown, ChevronUp, Volume2, VolumeX } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { aiService } from "@/api/services/ai.service";

interface AiAnswerCardProps {
  answer: string;
  generatedAt: string;
  model: string;
  images?: string[];
}



export const AiAnswerCard = ({ answer, generatedAt, model, images }: AiAnswerCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const toggleVoice = () => {
    if (isSpeaking) {
      const audioElement = document.getElementById('tts-audio-ai') as HTMLAudioElement;
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      setIsSpeaking(false);
    } else {
      speakText(answer);
    }
  };

  const speakText = async (text: string) => {
    // Check if text is too long
    if (text.length > 500) {
      setShowUpgrade(true);
      return;
    }

    setIsSpeaking(true);
    try {
      const audioBase64 = await aiService.textToSpeech(text);
      
      const audioElement = document.getElementById('tts-audio-ai') as HTMLAudioElement || document.createElement('audio');
      audioElement.id = 'tts-audio-ai';
      audioElement.src = `data:audio/mpeg;base64,${audioBase64}`;
      
      audioElement.onended = () => setIsSpeaking(false);
      audioElement.onerror = () => {
        setIsSpeaking(false);
        toast({
          title: "Voice Error",
          description: "Failed to play voice. Please try again.",
          variant: "destructive",
        });
      };

      await audioElement.play();
    } catch (error) {
      setIsSpeaking(false);
      toast({
        title: "Voice Error",
        description: "Failed to generate voice. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <>
    <Card className="p-4 md:p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-indigo-950/20 border-2 border-purple-200 dark:border-purple-800 shadow-lg">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">AI Generated Answer</h3>
            <Badge variant="secondary" className="gap-1 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              <Sparkles className="h-3 w-3" />
              {model}
            </Badge>
            {images && images.length > 0 && (
              <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                📊 {images.length} diagram{images.length > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Generated {new Date(generatedAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Display generated diagrams/images */}
      {images && images.length > 0 && (
        <div className="mb-6 space-y-4">
          <h4 className="font-semibold text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            AI-Generated Diagrams
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden border-2 border-purple-200 dark:border-purple-700 bg-white">
                <img 
                  src={image} 
                  alt={`Diagram ${index + 1}`}
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div 
        className="relative overflow-hidden transition-all duration-300"
        style={{ maxHeight: isExpanded ? 'none' : '400px' }}
      >
        <div 
          className="overflow-y-auto prose max-w-none"
          style={{ maxHeight: isExpanded ? 'none' : '400px' }}
        >
          <MarkdownRenderer content={answer} />
        </div>
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-purple-50 via-purple-50/80 to-transparent dark:from-purple-950/20 dark:via-purple-950/10 pointer-events-none" />
        )}
      </div>

      {/* Expand/Collapse and Voice Buttons */}
      <div className="flex justify-center gap-2 mt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2 text-purple-700 hover:text-purple-900 dark:text-purple-300 dark:hover:text-purple-100"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Show More
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleVoice}
          className={cn(
            "gap-2",
            isSpeaking
              ? "text-green-600 hover:text-green-700"
              : "text-purple-700 hover:text-purple-900 dark:text-purple-300 dark:hover:text-purple-100"
          )}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="h-4 w-4" />
              Stop
            </>
          ) : (
            <>
              <Volume2 className="h-4 w-4" />
              Listen
            </>
          )}
        </Button>
      </div>

      <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
        <p className="text-xs text-muted-foreground italic">
          💡 This answer was generated by AI{images && images.length > 0 ? ' with visual diagrams' : ''}. Please verify the solution and adapt it to your specific use case.
        </p>
      </div>
    </Card>

    {/* Upgrade Modal */}
    <Dialog open={showUpgrade} onOpenChange={setShowUpgrade}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">🎙️ Upgrade to Premium Voice</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              This content is too long for the free voice tier.
            </p>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
              <h3 className="text-xl font-bold mb-2">Premium Voice Features</h3>
              <ul className="text-left space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> Unlimited voice length
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> Premium voice quality
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> Multiple voice options
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span> Faster generation
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t">
                <p className="text-2xl font-bold text-purple-600">$5/month</p>
                <p className="text-xs text-muted-foreground">Cancel anytime</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowUpgrade(false)}>
              Maybe Later
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Upgrade Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};
