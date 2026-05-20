export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  image?: string;
  icon?: 'heart' | 'star' | 'camera' | 'plane' | 'coffee' | 'music';
}

export interface Reason {
  id: string;
  text: string;
  emoji: string;
}

export interface SiteConfig {
  partnerName: string;
  startDate: string; // ISO format string
  voiceMessageUrl?: string;
  backgroundMusicUrl?: string;
  letterContent: string[];
  timeline: TimelineEvent[];
  gallery: string[];
  reasons: Reason[];
  finalQuestion?: string;
  finalEventDate: string; // The proposal or wedding date for countdown
}
