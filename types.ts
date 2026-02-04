
export enum AppSection {
  LANDING = 'landing',
  GUIDANCE = 'guidance',
  FINANCE = 'finance',
  COMMUNITY = 'community',
  AI_LAB = 'ai-lab',
  VOICE = 'voice'
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  image?: string;
  groundingLinks?: { title: string; uri: string }[];
}

export interface SharedIdea {
  id: string;
  title: string;
  description: string;
  location?: string;
  image?: string;
  category: 'activity' | 'nature' | 'community';
}

export interface BudgetEntry {
  id: string;
  label: string;
  amount: number;
  type: 'income' | 'expense';
}

export interface ImageGenConfig {
  aspectRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
  imageSize: '1K' | '2K' | '4K';
}
