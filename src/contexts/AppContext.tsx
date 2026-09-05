import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ApiKey, PromptHistory, Character, AppearanceSettings, NotificationSettings, UserProfile } from '@/types';

interface AppContextType {
  // API Keys
  apiKeys: ApiKey[];
  setApiKeys: (keys: ApiKey[] | ((prev: ApiKey[]) => ApiKey[])) => void;
  
  // History
  history: PromptHistory[];
  setHistory: (history: PromptHistory[] | ((prev: PromptHistory[]) => PromptHistory[])) => void;
  
  // Characters
  characters: Character[];
  setCharacters: (chars: Character[] | ((prev: Character[]) => Character[])) => void;
  
  // User Profile
  profile: UserProfile;
  setProfile: (profile: UserProfile | ((prev: UserProfile) => UserProfile)) => void;
  
  // Settings
  appearance: AppearanceSettings;
  setAppearance: (settings: AppearanceSettings | ((prev: AppearanceSettings) => AppearanceSettings)) => void;
  
  notifications: NotificationSettings;
  setNotifications: (settings: NotificationSettings | ((prev: NotificationSettings) => NotificationSettings)) => void;
  
  // Active provider
  activeProvider: 'groq' | 'gemini';
  setActiveProvider: (provider: 'groq' | 'gemini') => void;
  
  // Sidebar state
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
}

const defaultProfile: UserProfile = {
  name: 'Pengguna Demo',
  email: 'demo@promptai.id',
  avatar: '',
};

const defaultAppearance: AppearanceSettings = {
  theme: 'dark',
  density: 'comfortable',
  fontSize: 'medium',
};

const defaultNotifications: NotificationSettings = {
  apiLimit: true,
  apiError: true,
  newFeatures: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [apiKeys, setApiKeys] = useLocalStorage<ApiKey[]>('api-keys', []);
  const [history, setHistory] = useLocalStorage<PromptHistory[]>('prompt-history', []);
  const [characters, setCharacters] = useLocalStorage<Character[]>('characters', []);
  const [profile, setProfile] = useLocalStorage<UserProfile>('user-profile', defaultProfile);
  const [appearance, setAppearance] = useLocalStorage<AppearanceSettings>('appearance', defaultAppearance);
  const [notifications, setNotifications] = useLocalStorage<NotificationSettings>('notifications', defaultNotifications);
  const [activeProvider, setActiveProvider] = useLocalStorage<'groq' | 'gemini'>('active-provider', 'gemini');
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage<boolean>('sidebar-collapsed', false);

  return (
    <AppContext.Provider
      value={{
        apiKeys,
        setApiKeys,
        history,
        setHistory,
        characters,
        setCharacters,
        profile,
        setProfile,
        appearance,
        setAppearance,
        notifications,
        setNotifications,
        activeProvider,
        setActiveProvider,
        sidebarCollapsed,
        setSidebarCollapsed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
