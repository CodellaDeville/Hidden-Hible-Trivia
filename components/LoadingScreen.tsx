import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in duration-700">
      <div className="relative">
        <div className="absolute inset-0 bg-ancient-gold blur-2xl opacity-10 rounded-full"></div>
        <Loader2 className="w-20 h-20 text-ancient-gold animate-spin-slow relative z-10" />
      </div>
      <h2 className="mt-8 text-3xl font-serif font-bold text-ancient-cream tracking-wide">Consulting the Archives...</h2>
      <p className="mt-2 text-ancient-muted italic font-serif text-lg">Unearthing historical scholarship.</p>
    </div>
  );
};