import React, { useEffect, useState } from 'react';

interface FloatingElement {
  id: number;
  char: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  depth: number; // 0 (far) to 1 (close)
  size: number; // base size
  rotation: number;
  floatOffset: number; // Random offset for the float animation
}

export const FloatingScripture: React.FC = () => {
  const [elements, setElements] = useState<FloatingElement[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // A mix of Hebrew, Greek, and early Christian/Ancient symbols
    const chars = [
      'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'י', // Hebrew
      'Ω', 'Σ', 'Δ', 'π', 'θ', 'Ψ', 'λ', // Greek
      '†', '⚓', '☧', '📜', '⚖️', '🕯️'  // Symbols
    ];
    
    const newElements: FloatingElement[] = [];
    
    // Create 30 random floating elements
    for (let i = 0; i < 30; i++) {
      newElements.push({
        id: i,
        char: chars[Math.floor(Math.random() * chars.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        depth: Math.random(), // 0.1 to 1.0
        size: Math.random() * 1.5 + 1, // 1rem to 2.5rem base
        rotation: Math.random() * 360,
        floatOffset: Math.random() * 2000, // Random start time for animation
      });
    }
    setElements(newElements);

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position (-1 to 1) from center of screen
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-b from-ancient-bg via-[#16120e] to-ancient-bg">
      {/* Atmosphere Fog Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-ancient-gold/5 to-transparent opacity-60 mix-blend-screen" />

      {elements.map((el) => {
        // PARALLAX MATH
        // Elements with higher 'depth' (closer) move MORE opposite to the mouse.
        // This simulates the camera moving.
        const movementFactor = 40 * el.depth; 
        const translateX = -(mousePos.x * movementFactor);
        const translateY = -(mousePos.y * movementFactor);

        // STYLES
        // Closer elements are larger and more opaque
        const finalSize = el.size + (el.depth * 2.5); // Range ~1rem to ~5rem
        const finalOpacity = 0.05 + (el.depth * 0.15); // Range 0.05 to 0.2
        const blurAmount = (1 - el.depth) * 2; // Further items are blurrier

        return (
          <div
            key={el.id}
            className="absolute font-serif font-bold text-ancient-gold will-change-transform select-none"
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              fontSize: `${finalSize}rem`,
              opacity: finalOpacity,
              filter: `blur(${blurAmount}px)`,
              // Combine Parallax translation with continuous gentle floating and initial rotation
              transform: `
                translate3d(${translateX}px, ${translateY}px, 0) 
                rotate(${el.rotation + (mousePos.x * 10 * el.depth)}deg)
              `,
              transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
              textShadow: `0 4px ${15 * el.depth}px rgba(212, 175, 55, ${0.3 * el.depth})`
            }}
          >
            <div 
              className="animate-float-slow" 
              style={{ animationDelay: `${-el.floatOffset}ms` }}
            >
              {el.char}
            </div>
          </div>
        );
      })}
    </div>
  );
};