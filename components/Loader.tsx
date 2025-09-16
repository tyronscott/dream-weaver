import React from 'react';

interface LoaderProps {
    isDark?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isDark = false }) => {
  const dotColor = isDark ? 'bg-violet-400' : 'bg-slate-400';
  
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className={`w-2 h-2 ${dotColor} rounded-full animate-bounce [animation-delay:-0.3s]`}></div>
      <div className={`w-2 h-2 ${dotColor} rounded-full animate-bounce [animation-delay:-0.15s]`}></div>
      <div className={`w-2 h-2 ${dotColor} rounded-full animate-bounce`}></div>
    </div>
  );
};

export default Loader;
