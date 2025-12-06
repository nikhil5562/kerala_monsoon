export type AlertLevel = 'Green' | 'Yellow' | 'Orange' | 'Red';

export interface DistrictData {
  id: string;
  name: string;
  alertLevel: AlertLevel;
  rainfall: string; // e.g., "45mm"
  floodRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  description: string;
}

export interface DamData {
  id: string;
  name: string;
  currentLevel: number; // in feet/meters
  maxLevel: number;
  unit: 'ft' | 'm';
  status: 'Normal' | 'Alert' | 'Warning' | 'Overflow';
}

export interface RiverData {
  id: string;
  name: string;
  level: number; // meters
  warningLevel: number;
  dangerLevel: number;
  trend: 'Rising' | 'Stable' | 'Falling';
  status: 'Normal' | 'Warning' | 'Danger';
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
  sources?: { title: string; uri: string }[];
  image?: string; // Base64 string
}

export interface UserLocation {
  district: string;
  localArea?: string; // Panchayat/Town
}

export interface AppSettings {
  largeText: boolean;
  highContrast: boolean;
  simpleLanguage: boolean;
  language: 'en' | 'ml'; // English or Malayalam
  location?: UserLocation;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}