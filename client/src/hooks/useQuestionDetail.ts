import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { questionsService, Question } from '@/api';
import { aiService } from '@/api/services/ai.service';
import * as party from "party-js";

export const useQuestionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiAnswer, setAiAnswer] = useState<any>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const fetchedQuestion = await questionsService.getById(id);
        setQuestion(fetchedQuestion);
        
        // Check if AI answer already exists
        const existingAiAnswer = await aiService.getAiAnswer(id);
        if (existingAiAnswer) {
          setAiAnswer(existingAiAnswer);
        }
      } catch (error) {
        console.error('Error fetching question:', error);
        toast({
          title: "Error",
          description: "Failed to load question details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  const refreshAnswers = async () => {
    if (!id) return;

    try {
      const fetchedQuestion = await questionsService.getById(id);
      setQuestion(fetchedQuestion);
    } catch (error) {
      console.error('Error refreshing answers:', error);
    }
  };

  const handleMarkSolved = async () => {
    if (!id || !question) return;

    try {
      await questionsService.markAsSolved(id);
      setQuestion({ ...question, solved: true });

      // Trigger confetti celebration
      party.confetti(document.body, {
        count: party.variation.range(80, 120),
        spread: party.variation.range(50, 80),
      });

      toast({
        title: "Question resolved!",
        description: "Great job solving this question!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark question as solved",
        variant: "destructive",
      });
    }
  };
  
  const handleGetAiAnswer = async () => {
    if (!question || !id) return;

    setIsGeneratingAi(true);
    try {
      const response = await aiService.answerQuestion(
        id,
        question.title,
        question.description
      );
      
      setAiAnswer(response);
      
      toast({
        title: "AI Answer Generated!",
        description: "Scroll down to see the detailed AI-generated answer with examples.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleGetSummary = async () => {
    if (!question || !id) return;

    setIsGeneratingSummary(true);
    try {
      const response = await aiService.generateSummary(
        id,
        question.title,
        question.description,
        question.answers || []
      );
      
      setSummary(response);
      setShowSummaryModal(true);
      
      toast({
        title: "Summary Generated!",
        description: "View the AI-generated summary of this discussion.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };


  return {
    id,
    question,
    loading,
    aiAnswer,
    isGeneratingAi,
    summary,
    isGeneratingSummary,
    showSummaryModal,
    setShowSummaryModal,
    refreshAnswers,
    handleMarkSolved,
    handleGetAiAnswer,
    handleGetSummary,
  };
};
