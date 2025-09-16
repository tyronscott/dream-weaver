import React from 'react';
import Loader from './Loader';

interface DreamscapeProps {
  onStartOver: () => void;
}

const Dreamscape: React.FC<DreamscapeProps> = ({ onStartOver }) => {
  return (
    <div className="w-full max-w-4xl h-[70vh] mx-auto flex flex-col items-center justify-center text-center p-4">
      <div data-transition-target="content" className="flex-1 w-full bg-slate-900 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-500 via-transparent to-transparent"></div>
        <h2 className="text-3xl font-bold text-white mb-4">Weaving the fabric of your dream...</h2>
        <p className="text-slate-400 mb-8">This is where your dream will come to life. (3D visualization coming soon)</p>
        <div className="space-y-4">
            <Loader isDark={true} />
            <p className="text-violet-400 animate-pulse">Initializing dream matrix...</p>
        </div>
      </div>
      <button
        data-transition-target="button"
        onClick={onStartOver}
        className="mt-8 px-8 py-3 bg-white/50 border border-slate-300/50 rounded-full text-slate-800 font-semibold shadow-lg backdrop-blur-sm hover:bg-white/80 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        Weave Another Dream
      </button>
    </div>
  );
};

export default Dreamscape;