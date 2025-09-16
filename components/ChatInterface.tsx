import React, { useState, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { MessageAuthor } from '../types';
import type { ChatMessage } from '../types';
import Loader from './Loader';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSubmit: (message: string) => void;
  isLoading: boolean;
  isRecreationReady: boolean;
}


const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSubmit, isLoading, isRecreationReady }) => {
    const [input, setInput] = useState('');
    const lastAiMessage = messages.slice().reverse().find(m => m.author === MessageAuthor.AI);
    const lastUserMessage = messages.slice().reverse().find(m => m.author === MessageAuthor.USER);
    
    const questionRef = useRef<HTMLHeadingElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (isLoading || !lastAiMessage) return;

        const tl = gsap.timeline();
        if (questionRef.current) {
            tl.fromTo(questionRef.current, 
                { opacity: 0, y: 30 }, 
                { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' }
            );
        }
        if (suggestionsRef.current) {
            tl.fromTo(suggestionsRef.current.children, 
                { opacity: 0, y: 20 }, 
                { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power4.out' },
                "-=0.5"
            );
        }
        if(formRef.current) {
             tl.fromTo(formRef.current, 
                { opacity: 0, y: 20 }, 
                { opacity: 1, y: 0, duration: 0.6, ease: 'power4.out' },
                "-=0.4"
            );
        }

    }, [lastAiMessage?.text]); // Animate when the AI message text changes
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSubmit(input);
            setInput('');
        }
    };
    
    const handleSuggestionClick = (suggestion: string) => {
        if (!isLoading) {
            onSubmit(suggestion);
        }
    }
    
    const renderContent = () => {
        if (isLoading && !lastAiMessage) {
             return <Loader />; // Initial load after dream input
        }

        if (!lastAiMessage) {
            // This case should ideally not be hit if there's always a first message
            return <p>Awaiting analysis...</p>;
        }

        return (
            <div className="w-full">
                {/* Previous user response for context */}
                {lastUserMessage && (
                     <p className="text-slate-500 mb-8 animate-fade-in">You said: "{lastUserMessage.text}"</p>
                )}

                <h2 ref={questionRef} className="text-3xl md:text-5xl font-bold text-slate-800 mb-12 leading-tight min-h-[5rem] md:min-h-[7.5rem]">
                    {lastAiMessage.text}
                </h2>
                
                {isLoading ? (
                    <Loader />
                ) : (
                    <>
                       <div ref={suggestionsRef} className="flex flex-wrap justify-center gap-3 mb-12">
                            {lastAiMessage.suggestions?.map((suggestion, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    disabled={isRecreationReady}
                                    className="px-6 py-3 bg-white/50 border border-slate-300/50 rounded-full text-slate-700 font-medium shadow-md backdrop-blur-sm hover:bg-white/80 hover:border-violet-300 hover:text-violet-600 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>

                        {!isRecreationReady && (
                           <div ref={formRef} className="w-full max-w-xl mx-auto">
                                <form onSubmit={handleSubmit} className="relative">
                                    <input 
                                        type="text" 
                                        value={input} 
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Or type your own response..."
                                        disabled={isLoading}
                                        className="w-full pl-6 pr-16 py-4 bg-white/60 border border-slate-300/50 rounded-full shadow-lg backdrop-blur-sm text-lg focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all duration-300"
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={isLoading || !input.trim()}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-violet-500 text-white rounded-full flex items-center justify-center font-semibold shadow-lg hover:bg-violet-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-110"
                                        aria-label="Send message"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                        )}
                    </>
                )}

                 {isRecreationReady && (
                     <div className="mt-12 text-lg text-violet-600 font-semibold animate-pulse">
                        We have enough to begin... preparing the dreamscape.
                    </div>
                 )}
            </div>
        )
    }

    return (
        <div data-transition-target="container" className="w-full max-w-3xl mx-auto h-[80vh] flex flex-col items-center justify-center text-center p-4">
           {renderContent()}
        </div>
    );
};

export default ChatInterface;