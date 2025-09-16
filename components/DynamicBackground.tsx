import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface DynamicBackgroundProps {
  context: string[];
}

// A mapping of keywords to Tailwind CSS background color classes
const colorMap: { [key: string]: string } = {
  // Themes
  forest: 'bg-emerald-300',
  ocean: 'bg-sky-400',
  water: 'bg-blue-300',
  sky: 'bg-cyan-200',
  fly: 'bg-indigo-200',
  night: 'bg-slate-700',
  dark: 'bg-gray-600',
  city: 'bg-slate-400',
  space: 'bg-indigo-800',
  fire: 'bg-orange-400',
  sun: 'bg-yellow-300',
  light: 'bg-yellow-100',
  
  // Emotions
  happy: 'bg-yellow-200',
  joy: 'bg-amber-200',
  sad: 'bg-slate-400',
  anxious: 'bg-indigo-400',
  fear: 'bg-gray-500',
  calm: 'bg-teal-200',
  peaceful: 'bg-cyan-100',
  love: 'bg-pink-300',
  angry: 'bg-red-400',
  confused: 'bg-purple-300',

  // Colors
  red: 'bg-red-300',
  blue: 'bg-blue-400',
  green: 'bg-green-400',
  yellow: 'bg-yellow-200',
  purple: 'bg-purple-400',
  orange: 'bg-orange-300',
  pink: 'bg-pink-200',
  white: 'bg-white',
  black: 'bg-black',
  gray: 'bg-gray-400',
  
  // Misc
  misty: 'bg-slate-200',
  color: 'bg-violet-200',
  begin: 'bg-lime-200',
  ready: 'bg-teal-300',
  complete: 'bg-indigo-300',
};

const defaultColors = ['bg-purple-100', 'bg-blue-100', 'bg-violet-200', 'bg-slate-100'];

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ context }) => {
  const orbsRef = useRef<HTMLDivElement[]>([]);

  // FIX: The `backgroundColor` property in GSAP cannot animate Tailwind classes, causing a type error.
  // The fix is to remove the property from the GSAP tween and instead rely on CSS transitions.
  // The logic has been combined into a single loop to update both GSAP animations and class names efficiently.
  useLayoutEffect(() => {
    const getOrbColor = (index: number): string => {
        if (context && context.length > 0) {
            const keyword = context[index % context.length]; // Cycle through keywords if not enough
            return colorMap[keyword] || defaultColors[index % defaultColors.length];
        }
        return defaultColors[index % defaultColors.length];
    }

    orbsRef.current.forEach((orb, index) => {
      if (orb) {
        // Animate orb position and scale with GSAP
        gsap.to(orb, {
          duration: 4,
          ease: 'power1.inOut',
          x: `${gsap.utils.random(-50, 50)}vw`,
          y: `${gsap.utils.random(-50, 50)}vh`,
          scale: gsap.utils.random(0.8, 1.5),
        });

        // The color change is handled by updating Tailwind classes. The orb element has
        // `transition-colors` which smoothly animates the background color change.
        const newColorClass = getOrbColor(index);
        
        // Remove any existing color classes before adding the new one.
        Object.values(colorMap).forEach(c => orb.classList.remove(c));
        defaultColors.forEach(c => orb.classList.remove(c));
        orb.classList.add(newColorClass);
      }
    });

  }, [context]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(4)].map((_, i) => (
             <div 
                key={i}
                ref={el => { if(el) orbsRef.current[i] = el; }}
                className={`absolute w-[50vmax] h-[50vmax] rounded-full filter blur-3xl opacity-20 transition-colors duration-[4000ms] ease-in-out ${defaultColors[i]}`}
            />
        ))}
    </div>
  );
};

export default DynamicBackground;