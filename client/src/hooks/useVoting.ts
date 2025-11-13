import { useState, useEffect } from 'react';

interface VoteData {
  [key: string]: 'up' | 'down' | null;
}

const VOTES_STORAGE_KEY = 'devoverflow_votes';

export const useVoting = (type: 'question' | 'answer') => {
  const [votes, setVotes] = useState<VoteData>(() => {
    const stored = localStorage.getItem(VOTES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  useEffect(() => {
    localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(votes));
  }, [votes]);

  const vote = (id: string, direction: 'up' | 'down') => {
    setVotes(prev => {
      const currentVote = prev[`${type}_${id}`];
      const newVote = currentVote === direction ? null : direction;
      return {
        ...prev,
        [`${type}_${id}`]: newVote
      };
    });
  };

  const getVote = (id: string) => votes[`${type}_${id}`] || null;

  const getScore = (id: string, baseScore: number) => {
    const vote = getVote(id);
    if (vote === 'up') return baseScore + 1;
    if (vote === 'down') return baseScore - 1;
    return baseScore;
  };

  return { vote, getVote, getScore };
};
