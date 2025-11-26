import React from 'react';
import { Button } from './Button';
import { RefreshCcw, Award, BookOpenCheck } from 'lucide-react';

interface SummaryScreenProps {
  score: number;
  total: number;
  onRestart: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({ score, total, onRestart }) => {
  const percentage = Math.round((score / total) * 100);
  
  let message = "";
  let subMessage = "";

  if (percentage >= 90) {
    message = "Biblical Scholar";
    subMessage = "Outstanding! You have a deep grasp of historical nuance.";
  } else if (percentage >= 70) {
    message = "Diligent Student";
    subMessage = "Great job. You know your history better than most.";
  } else if (percentage >= 50) {
    message = "Curious Seeker";
    subMessage = "Good effort. History is full of surprises, isn't it?";
  } else {
    message = "Tradition Challenger";
    subMessage = "A tough round! Many of these facts are rarely taught.";
  }

  return (
    <div className="max-w-2xl mx-auto text-center animate-in zoom-in-95 duration-500">
      <div className="bg-ancient-card p-10 rounded-2xl shadow-2xl border-t-8 border-ancient-gold relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ancient-gold to-transparent opacity-50"></div>

        <div className="mb-8">
            <div className="w-24 h-24 bg-stone-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-stone-800 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                {percentage >= 70 ? (
                    <Award className="w-12 h-12 text-ancient-gold" />
                ) : (
                    <BookOpenCheck className="w-12 h-12 text-stone-500" />
                )}
            </div>
            <h2 className="text-4xl font-serif font-bold text-ancient-cream mb-2">{message}</h2>
            <p className="text-stone-400 font-serif italic text-lg">{subMessage}</p>
        </div>

        <div className="bg-black/20 p-6 rounded-lg mb-10 border border-stone-800">
          <p className="text-sm font-bold text-stone-500 uppercase tracking-widest mb-2">Final Score</p>
          <div className="text-6xl font-serif font-bold text-ancient-gold">
            {score}<span className="text-3xl text-stone-600">/{total}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={onRestart} fullWidth className="text-lg py-4 flex items-center justify-center gap-2">
            <RefreshCcw className="w-5 h-5" /> Play Again
          </Button>
        </div>
      </div>
    </div>
  );
};