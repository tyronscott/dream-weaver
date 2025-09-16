import React, { useState, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import type { Chat, GenerateContentResponse } from '@google/genai';

import { AppStage, MessageAuthor } from './types';
import type { ChatMessage, ParsedAiResponse } from './types';
import { createChatSession } from './services/geminiService';

import Intro from './components/Intro';
import DreamInput from './components/DreamInput';
import ChatInterface from './components/ChatInterface';
import Dreamscape from './components/Dreamscape';
import DynamicBackground from './components/DynamicBackground';


const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>(AppStage.INTRO);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecreationReady, setIsRecreationReady] = useState(false);
  const [dreamContext, setDreamContext] = useState<string[]>([]);
  const chatRef = useRef<Chat | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const transitionTo = (newStage: AppStage) => {
    if (contentRef.current) {
       // Find all animatable elements in the current component
      const elements = Array.from(contentRef.current.querySelectorAll('[data-transition-target]'));
      
      gsap.to(elements.reverse(), { // Reverse to animate from bottom-to-top of the DOM
          opacity: 0,
          y: -30,
          skewX: '5deg',
          duration: 0.4,
          stagger: 0.07,
          ease: 'power3.in',
          onComplete: () => {
              // Reset props for the next transition-in
              gsap.set(elements, { clearProps: 'all' });
              setStage(newStage);
          },
      });
    } else {
      setStage(newStage);
    }
  };
  
  useLayoutEffect(() => {
    if (contentRef.current) {
        // Find all animatable elements in the new component
        const elements = contentRef.current.querySelectorAll('[data-transition-target]');
        gsap.from(elements, {
            opacity: 0,
            y: 30,
            skewX: '-5deg',
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.3, // A little delay for the stage change to settle
        });
    }
  }, [stage]);

  const handleApiResponse = (text: string) => {
    try {
      const parsed: ParsedAiResponse = JSON.parse(text);
      const aiResponse: ChatMessage = {
        author: MessageAuthor.AI,
        text: parsed.question,
        suggestions: parsed.suggestions,
        context: parsed.context,
      };
      setMessages(prev => [...prev, aiResponse]);
      if(parsed.context) {
        setDreamContext(parsed.context);
      }
      
      if (parsed.recreationReady) {
        setIsRecreationReady(true);
        setTimeout(() => transitionTo(AppStage.RECREATION), 3000);
      }
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      const errorMessage: ChatMessage = { 
        author: MessageAuthor.AI, 
        text: "I'm sorry, my connection to the dream world is a bit hazy right now. Please try again later.",
        suggestions: ["Let's try again"]
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleDreamSubmit = async (dream: string) => {
    transitionTo(AppStage.ANALYSIS);
    setIsLoading(true);

    const firstUserMessage: ChatMessage = { author: MessageAuthor.USER, text: dream };
    setMessages([firstUserMessage]);
    
    try {
      chatRef.current = createChatSession();
      const response = await chatRef.current.sendMessage({ message: dream });
      handleApiResponse(response.text);
    } catch (error) {
      console.error("Failed to get response from Gemini:", error);
      const errorMessage: ChatMessage = { 
        author: MessageAuthor.AI, 
        text: "I'm sorry, my connection to the dream world is a bit hazy right now. Please try again later." 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatMessageSubmit = async (message: string) => {
    if (!chatRef.current || isLoading) return;

    const newUserMessage: ChatMessage = { author: MessageAuthor.USER, text: message };
    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await chatRef.current.sendMessage({ message });
      handleApiResponse(response.text);
    } catch (error) {
      console.error("Failed to send message to Gemini:", error);
      const errorMessage: ChatMessage = { 
        author: MessageAuthor.AI, 
        text: "I seem to have lost my train of thought. Could you repeat that?" 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStartOver = () => {
    setMessages([]);
    chatRef.current = null;
    setIsRecreationReady(false);
    setDreamContext([]);
    transitionTo(AppStage.INTRO);
  };

  const renderStage = () => {
    switch (stage) {
      case AppStage.INTRO:
        return <Intro onComplete={() => transitionTo(AppStage.DREAM_INPUT)} />;
      case AppStage.DREAM_INPUT:
        return <DreamInput onSubmit={handleDreamSubmit} />;
      case AppStage.ANALYSIS:
        return (
          <ChatInterface
            messages={messages}
            onSubmit={handleChatMessageSubmit}
            isLoading={isLoading}
            isRecreationReady={isRecreationReady}
          />
        );
      case AppStage.RECREATION:
        return <Dreamscape onStartOver={handleStartOver} />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center font-sans text-slate-800 p-4 relative overflow-hidden bg-slate-50" style={{ perspective: '1000px' }}>
       <DynamicBackground context={dreamContext} />
       <div ref={contentRef} className="z-10 w-full" style={{ transformStyle: 'preserve-3d' }}>
        {renderStage()}
      </div>
    </main>
  );
};

export default App;