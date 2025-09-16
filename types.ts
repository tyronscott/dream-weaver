export enum AppStage {
  INTRO,
  DREAM_INPUT,
  ANALYSIS,
  RECREATION,
}

export enum MessageAuthor {
  USER = 'user',
  AI = 'ai',
}

export interface ChatMessage {
  author: MessageAuthor;
  text: string;
  suggestions?: string[];
  context?: string[];
}

export interface ParsedAiResponse {
    question: string;
    suggestions: string[];
    context?: string[];
    recreationReady?: boolean;
}