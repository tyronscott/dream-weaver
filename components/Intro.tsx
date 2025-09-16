import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';

interface IntroProps {
  onComplete: () => void;
}

const Intro: React.FC<IntroProps> = ({ onComplete }) => {
  const orbRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (orbRef.current) {
        gsap.to(orbRef.current, {
            duration: 5,
            scale: 1.1,
            rotationY: 360,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });
        gsap.to(orbRef.current, {
          duration: 4,
          boxShadow: '0 0 40px 10px rgba(168, 85, 247, 0.3), 0 0 80px 20px rgba(99, 102, 241, 0.2)',
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        });
    }
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center text-center h-screen max-h-[600px]">
      <div data-transition-target="orb" ref={orbRef} className="w-32 h-32 md:w-48 md:h-48 bg-white/50 rounded-full mb-12 shadow-xl backdrop-blur-md border border-white/20"></div>
      <h1 data-transition-target="title" className="text-4xl md:text-6xl font-bold tracking-tighter text-slate-900 mb-4">Dream Weaver</h1>
      <p data-transition-target="subtitle" className="text-lg md:text-xl text-slate-600 max-w-md mb-8">
        Unlock the secrets of your subconscious. Let's explore the world behind your eyes.
      </p>
      <button
        data-transition-target="button"
        onClick={onComplete}
        className="px-8 py-3 bg-white/50 border border-slate-300/50 rounded-full text-slate-800 font-semibold shadow-lg backdrop-blur-sm hover:bg-white/80 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        Begin Weaving
      </button>
    </div>
  );
};

export default Intro;