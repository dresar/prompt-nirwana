export interface ApiKey {
  id: string;
  name: string;
  key: string;
  provider: 'groq' | 'gemini';
  status: 'active' | 'limit' | 'error' | 'backup';
  isEnabled: boolean;
  priority: number;
  createdAt: Date;
  lastUsed?: Date;
}

export interface PromptHistory {
  id: string;
  type: 'image' | 'video' | 'character' | 'enhance' | 'negative';
  prompt: string;
  createdAt: Date;
  isFavorite: boolean;
}

export interface Character {
  id: string;
  name: string;
  age: string;
  gender: string;
  faceFeatures: string;
  clothing: string;
  style: string;
  mood: string;
  createdAt: Date;
}

export interface Template {
  id: string;
  name: string;
  category: 'cinematic' | 'anime' | 'advertisement' | 'horror' | 'documentary' | 'fantasy' | 'scifi';
  description: string;
  prompt: string;
  thumbnail: string;
}

export interface WorkflowStep {
  id: string;
  type: 'image' | 'video';
  description: string;
  prompt?: string;
  imageUrl?: string;
  order: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

export interface NotificationSettings {
  apiLimit: boolean;
  apiError: boolean;
  newFeatures: boolean;
}

export interface AppearanceSettings {
  theme: 'dark' | 'light' | 'system';
  density: 'compact' | 'comfortable' | 'spacious';
  fontSize: 'small' | 'medium' | 'large';
}
