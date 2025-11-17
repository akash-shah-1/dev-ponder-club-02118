import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { aiService } from '@/api/services/ai.service';

export const useSummaryVoice = (summary: string, audioId: string) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const speakText = async (text: string) => {
    // Check usage count
    const usageCount = parseInt(localStorage.getItem('voice_usage_count') || '0');
    
    if (usageCount >= 1) {
      setShowUpgrade(true);
      return;
    }

    // Check if text is too long
    if (text.length > 500) {
      setShowUpgrade(true);
      return;
    }

    setIsSpeaking(true);
    try {
      const audioBase64 = await aiService.textToSpeech(text);
      
      const audioElement = document.getElementById(audioId) as HTMLAudioElement || document.createElement('audio');
      audioElement.id = audioId;
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
      
      // Increment usage count
      const newCount = parseInt(localStorage.getItem('voice_usage_count') || '0') + 1;
      localStorage.setItem('voice_usage_count', newCount.toString());
    } catch (error) {
      setIsSpeaking(false);
      toast({
        title: "Voice Error",
        description: "Failed to generate voice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleVoice = () => {
    if (isSpeaking) {
      const audioElement = document.getElementById(audioId) as HTMLAudioElement;
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      setIsSpeaking(false);
    } else {
      speakText(summary);
    }
  };

  const stopVoice = () => {
    if (isSpeaking) {
      const audioElement = document.getElementById(audioId) as HTMLAudioElement;
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      setIsSpeaking(false);
    }
  }

  return { isSpeaking, showUpgrade, setShowUpgrade, toggleVoice, stopVoice };
};
