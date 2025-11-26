import React, { useState } from 'react';
import { Question } from '../types';
import { Button } from './Button';
import { CheckCircle2, XCircle, ArrowRight, Info, Volume2, VolumeX } from 'lucide-react';
// @ts-ignore
import confetti from 'canvas-confetti';

interface QuizScreenProps {
  questions: Question[];
  onComplete: (score: number) => void;
}

// Sound Effects URLs
const SOUNDS = {
  APPLAUSE: 'https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c7443c.mp3', // Short crowd cheer
  BUZZ: 'https://cdn.pixabay.com/audio/2021/08/04/audio_c6ccf3232f.mp3', // Distinct Negative/Wrong Beep
  CLICK: 'https://cdn.pixabay.com/audio/2022/03/15/audio_736881c626.mp3' // Soft click
};

export const QuizScreen: React.FC<QuizScreenProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  const playSound = (type: 'APPLAUSE' | 'BUZZ' | 'CLICK') => {
    if (!soundEnabled) return;
    const audio = new Audio(SOUNDS[type]);
    
    // Volume mixing
    if (type === 'BUZZ') {
      audio.volume = 0.8; 
    } else if (type === 'APPLAUSE') {
      audio.volume = 0.6;
    } else {
      audio.volume = 0.4;
    }

    audio.play().catch(e => console.log("Audio play failed (interaction required):", e));
  };

  const triggerConfetti = () => {
    const duration = 2000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#d4af37', '#e6e0d4', '#ffffff'] // Gold, Cream, White
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#d4af37', '#e6e0d4', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleOptionSelect = (index: number) => {
    if (isRevealed) return;
    playSound('CLICK');
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    setIsRevealed(true);
    const isCorrect = selectedOption === currentQuestion.correct_index;

    if (isCorrect) {
      setScore(s => s + 1);
      playSound('APPLAUSE');
      triggerConfetti();
    } else {
      playSound('BUZZ');
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsRevealed(false);
    } else {
      onComplete(score + (selectedOption === currentQuestion.correct_index ? 1 : 0));
    }
  };

  if (!currentQuestion) return null;

  return (
    <div className="max-w-3xl mx-auto w-full animate-in fade-in duration-500">
      
      {/* Header controls */}
      <div className="mb-4 flex justify-end">
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-stone-500 hover:text-ancient-gold transition-colors p-2"
          title={soundEnabled ? "Mute Sounds" : "Enable Sounds"}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* Progress Header */}
      <div className="mb-8 flex items-center justify-between text-ancient-muted font-sans font-bold uppercase text-xs tracking-widest">
        <span>Question {currentIndex + 1} of {questions.length}</span>
        <span>Score: {score}</span>
      </div>
      <div className="w-full bg-stone-800 h-1.5 rounded-full mb-8 overflow-hidden border border-stone-700">
        <div 
          className="bg-ancient-gold h-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(212,175,55,0.6)]" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="bg-ancient-card rounded-xl shadow-2xl border border-stone-700 overflow-hidden mb-6">
        <div className="bg-black/30 p-4 border-b border-stone-800 flex justify-between items-center">
            <span className="text-xs font-bold tracking-wider uppercase text-ancient-gold bg-ancient-gold/10 px-2 py-1 rounded border border-ancient-gold/20">
              {currentQuestion.category}
            </span>
            <span className="text-xs font-bold text-stone-500 uppercase">
              {currentQuestion.difficulty}
            </span>
        </div>
        
        <div className="p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ancient-cream leading-tight mb-8 drop-shadow-md">
            {currentQuestion.question}
          </h2>

          <div className="grid gap-3">
            {currentQuestion.options.map((option, idx) => {
              let btnClass = "border-2 border-stone-700 hover:border-stone-500 bg-stone-900/50 text-stone-300";
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuestion.correct_index;
              
              if (isRevealed) {
                if (isCorrect) {
                  btnClass = "border-green-600 bg-green-900/30 text-green-100";
                } else if (isSelected && !isCorrect) {
                  btnClass = "border-red-500 bg-red-900/30 text-red-100";
                } else {
                  btnClass = "border-stone-800 text-stone-600 opacity-40";
                }
              } else if (isSelected) {
                btnClass = "border-ancient-gold bg-ancient-gold/10 text-ancient-gold ring-2 ring-ancient-gold/20";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={isRevealed}
                  className={`w-full text-left p-4 rounded-lg text-lg font-serif transition-all duration-200 relative ${btnClass}`}
                >
                  <div className="flex items-center">
                    <span className={`w-8 h-8 rounded-full border flex items-center justify-center mr-4 text-sm font-sans font-bold shrink-0 
                      ${isSelected || (isRevealed && isCorrect) ? 'border-current' : 'border-stone-600 text-stone-500'}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                    {isRevealed && isCorrect && <CheckCircle2 className="ml-auto w-6 h-6 text-green-500 animate-in zoom-in spin-in-12 duration-300" />}
                    {isRevealed && isSelected && !isCorrect && <XCircle className="ml-auto w-6 h-6 text-red-500" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Explanation Section (Revealed after answer) */}
      {isRevealed && (
        <div className="bg-stone-900/90 text-stone-200 rounded-xl p-6 mb-6 shadow-xl border border-stone-700 animate-in slide-in-from-bottom-2 backdrop-blur-md">
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-ancient-gold shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-ancient-gold mb-2 uppercase tracking-wide text-sm">Historical Context</h3>
              <p className="font-serif text-lg leading-relaxed mb-4 text-ancient-cream">
                {currentQuestion.short_explanation}
              </p>
              <p className="text-xs text-stone-500 italic border-t border-stone-800 pt-3">
                Source Note: {currentQuestion.source_style_note}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="flex justify-end pt-4 pb-12">
        {!isRevealed ? (
          <Button 
            onClick={handleSubmit} 
            disabled={selectedOption === null}
            className="w-full sm:w-auto text-lg px-12"
          >
            Check Answer
          </Button>
        ) : (
          <Button 
            onClick={handleNext} 
            variant="secondary"
            className="w-full sm:w-auto text-lg px-12 flex items-center justify-center gap-2"
          >
            {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            <ArrowRight className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
};