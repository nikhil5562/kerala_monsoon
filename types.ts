export type AlertLevel = 'Green' | 'Yellow' | 'Orange' | 'Red';

export interface DistrictData {
  id: string;
  name: string;
  alertLevel: AlertLevel;
  rainfall: string; // e.g., "45mm"
  floodRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  description: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface AppSettings {
  largeText: boolean;
  highContrast: boolean;
  simpleLanguage: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}