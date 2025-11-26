import React, { useState } from 'react';
import { SetupScreen } from './components/SetupScreen';
import { QuizScreen } from './components/QuizScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { FloatingScripture } from './components/FloatingScripture';
import { GameSettings, GameState, Question } from './types';
import { generateQuestions } from './services/geminiService';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.SETUP);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [score, setScore] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const startGame = async (settings: GameSettings) => {
    setGameState(GameState.LOADING);
    setErrorMsg("");
    try {
      const data = await generateQuestions(settings);
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setGameState(GameState.PLAYING);
      } else {
        throw new Error("Received empty question set.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to generate trivia. Please check your API key or try again.");
      setGameState(GameState.ERROR);
    }
  };

  const handleQuizComplete = (finalScore: number) => {
    setScore(finalScore);
    setGameState(GameState.SUMMARY);
  };

  const restartGame = () => {
    setScore(0);
    setQuestions([]);
    setGameState(GameState.SETUP);
  };

  return (
    <>
      <FloatingScripture />
      
      <div className="relative z-10 min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* App Content */}
        <main className="w-full max-w-4xl">
          {gameState === GameState.SETUP && (
            <SetupScreen onStart={startGame} />
          )}

          {gameState === GameState.LOADING && (
            <LoadingScreen />
          )}

          {gameState === GameState.PLAYING && (
            <QuizScreen questions={questions} onComplete={handleQuizComplete} />
          )}

          {gameState === GameState.SUMMARY && (
            <SummaryScreen score={score} total={questions.length} onRestart={restartGame} />
          )}

          {gameState === GameState.ERROR && (
            <div className="text-center p-8 bg-red-900/30 border border-red-800 rounded-xl max-w-md mx-auto backdrop-blur-sm">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-200 mb-2">Something went wrong</h3>
              <p className="text-red-300 mb-6">{errorMsg}</p>
              <button 
                onClick={restartGame}
                className="px-6 py-2 bg-red-800 hover:bg-red-700 text-white rounded transition-colors border border-red-600"
              >
                Try Again
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-auto py-6 text-center text-ancient-muted text-sm font-serif">
          <p>&copy; {new Date().getFullYear()} Hidden Bible Trivia. Powered by Gemini.</p>
        </footer>
      </div>
    </>
  );
};

export default App;