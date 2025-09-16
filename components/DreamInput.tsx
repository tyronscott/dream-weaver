import React, { useState } from 'react';

interface DreamInputProps {
  onSubmit: (dream: string) => void;
}

const DreamInput: React.FC<DreamInputProps> = ({ onSubmit }) => {
  const [dream, setDream] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dream.trim()) {
      onSubmit(dream);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center p-4">
      <h2 data-transition-target="title" className="text-3xl font-bold text-slate-800 mb-4 text-center">Tell me about your dream...</h2>
      <p data-transition-target="subtitle" className="text-slate-500 mb-8 text-center">Don't hold back. Describe the scenes, the feelings, the colors, the absurdities.</p>
      <form onSubmit={handleSubmit} className="w-full">
        <textarea
          data-transition-target="textarea"
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="Last night, I dreamt of..."
          className="w-full h-64 p-4 bg-white/60 border border-slate-300/50 rounded-2xl shadow-lg backdrop-blur-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all duration-300"
        ></textarea>
        <div data-transition-target="button-container" className="flex justify-center mt-8">
            <button
            type="submit"
            disabled={!dream.trim()}
            className="px-8 py-3 bg-violet-500 text-white rounded-full font-semibold shadow-lg hover:bg-violet-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105"
            >
            Analyze Dream
            </button>
        </div>
      </form>
    </div>
  );
};

export default DreamInput;