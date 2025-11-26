import React, { useState } from 'react';
import { Category, Difficulty, GameSettings, ComparativeSource } from '../types';
import { Button } from './Button';
import { BookOpen, Scroll, Hourglass, Globe2 } from 'lucide-react';

interface SetupScreenProps {
  onStart: (settings: GameSettings) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [count, setCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<Difficulty>('mixed');
  const [category, setCategory] = useState<Category>('Mixed');
  const [comparativeSource, setComparativeSource] = useState<ComparativeSource>('None');

  const categories: Category[] = [
    'Mixed',
    'Authorship & Dating',
    'Canon & Missing Books',
    'Translation & Textual Issues',
    'Historical & Cultural Context',
    'Common Misconceptions'
  ];

  const comparativeSources: { id: ComparativeSource; label: string; desc: string }[] = [
    { id: 'None', label: 'Bible Only', desc: 'Focus strictly on biblical history' },
    { id: 'Enoch & The Watchers', label: 'Book of Enoch', desc: 'Watchers, Nephilim, Giants' },
    { id: 'Gnostic & Apocryphal', label: 'Gnostic Gospels', desc: 'Nag Hammadi, Thomas, Judas' },
    { id: 'Dead Sea Scrolls', label: 'Dead Sea Scrolls', desc: 'Qumran, Essenes, Manual of Discipline' },
    { id: 'Babylonian & Sumerian', label: 'Babylonian Tablets', desc: 'Gilgamesh, Enuma Elish, Theodicy' },
    { id: 'Egyptian & Book of Thoth', label: 'Egypt & Hermetica', desc: 'Book of Thoth, Amenemope' },
    { id: 'Canaanite & Ugaritic', label: 'Canaanite Myths', desc: 'Baal Cycle, El, Divine Council' },
    { id: 'Zoroastrian (Avesta)', label: 'Zoroastrianism', desc: 'Avesta, Dualism, Angelology' },
    { id: 'Eastern (Gita/Tao)', label: 'Eastern Wisdom', desc: 'Bhagavad Gita, Vedas, Taoism' },
    { id: 'Hellenistic & Greek', label: 'Greek Philosophy', desc: 'Plato, Stoics, The Logos' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4 mb-10">
        <div className="inline-block p-4 rounded-full bg-ancient-card border-2 border-ancient-gold shadow-[0_0_20px_rgba(212,175,55,0.2)] mb-4">
          <Scroll className="w-12 h-12 text-ancient-gold" />
        </div>
        <h1 className="text-5xl font-serif font-bold text-ancient-cream mb-2 tracking-tight drop-shadow-lg">Hidden Bible Trivia</h1>
        <p className="text-lg text-ancient-muted italic font-serif max-w-lg mx-auto">
          "Test your knowledge against history, scholarship, and ancient parallels."
        </p>
      </div>

      <div className="bg-ancient-card p-8 rounded-xl shadow-2xl border border-stone-800 relative overflow-hidden backdrop-blur-sm">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-ancient-gold/10 to-transparent rounded-bl-full pointer-events-none"></div>

        <div className="space-y-8">
          
          {/* Question Count */}
          <div>
            <label className="block text-sm font-bold text-ancient-muted uppercase tracking-wider mb-2 flex items-center gap-2">
              <Hourglass className="w-4 h-4 text-ancient-gold" /> Number of Questions
            </label>
            <div className="flex gap-4">
              {[3, 5, 10, 15].map((val) => (
                <button
                  key={val}
                  onClick={() => setCount(val)}
                  className={`flex-1 py-3 rounded border-2 font-serif text-lg transition-all
                    ${count === val 
                      ? 'border-ancient-gold bg-ancient-gold/20 text-ancient-gold font-bold shadow-[0_0_10px_rgba(212,175,55,0.2)]' 
                      : 'border-stone-700 text-stone-500 hover:border-stone-600 hover:text-stone-300'}`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>

          {/* Comparative Source (New Section) */}
          <div>
            <label className="block text-sm font-bold text-ancient-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-ancient-gold" /> Ancient Parallels (Optional)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {comparativeSources.map((source) => (
                <button
                  key={source.id}
                  onClick={() => setComparativeSource(source.id)}
                  className={`p-3 text-left rounded-lg border transition-all relative overflow-hidden group
                    ${comparativeSource === source.id
                      ? 'bg-ancient-gold/90 text-ancient-bg border-ancient-gold shadow-lg'
                      : 'bg-black/20 text-stone-400 border-stone-800 hover:bg-stone-800 hover:text-stone-200'
                    }`}
                >
                  <div className="font-bold text-sm sm:text-base">{source.label}</div>
                  <div className={`text-xs mt-1 ${comparativeSource === source.id ? 'text-ancient-bg/80' : 'text-stone-600 group-hover:text-stone-500'}`}>
                    {source.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Difficulty */}
            <div>
              <label className="block text-sm font-bold text-ancient-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-ancient-gold" /> Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full p-4 rounded-lg border-2 border-stone-700 bg-black/40 text-ancient-cream font-serif text-lg focus:outline-none focus:border-ancient-gold transition-colors appearance-none cursor-pointer"
              >
                <option value="easy">Beginner (Major anomalies)</option>
                <option value="medium">Scholar (Specific details)</option>
                <option value="hard">Expert (Deep textual issues)</option>
                <option value="mixed">Mixed Bag</option>
              </select>
            </div>

            {/* Category (Only relevant if not comparing) */}
            <div className={comparativeSource !== 'None' ? 'opacity-50 pointer-events-none grayscale' : ''}>
              <label className="block text-sm font-bold text-ancient-muted uppercase tracking-wider mb-2 flex items-center gap-2">
                <Scroll className="w-4 h-4 text-ancient-gold" /> Biblical Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full p-4 rounded-lg border-2 border-stone-700 bg-black/40 text-ancient-cream font-serif text-lg focus:outline-none focus:border-ancient-gold transition-colors appearance-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="pt-4">
            <Button 
              onClick={() => onStart({ count, difficulty, category, comparativeSource })} 
              fullWidth
              className="text-lg py-4"
            >
              Generate Questions
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};