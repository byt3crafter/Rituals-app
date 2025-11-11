export type RitualState = 'idle' | 'active' | 'completed' | 'aborted';
export type RitualCategory = 'Body' | 'Mind' | 'Spirit';
export type TrackingMethod = 'timer' | 'check-in';

export interface Ritual {
  id: string;
  name: string;
  category: RitualCategory;
  intention: string;
  trackingMethod: TrackingMethod;
  durationHours?: number; // Optional, only for timer-based rituals
}

export type Intention = {
  id: number;
  text: string;
  completed: boolean;
};

export type RitualSession = {
  ritualId: string;
  ritualName: string;
  startTime: number;
  endTime: number;
  durationHours?: number;
  completed: boolean;
};

export type Tab = 'timer' | 'progress' | 'mentor' | 'settings';

export type MentorMessage = {
  id: number;
  text: string;
  sender: 'user' | 'mentor';
  isLoading?: boolean;
};

export type MilestoneInfo = {
  hour: number;
  name: string;
  description: string;
  icon: 'droplet' | 'bolt' | 'key' | 'flame' | 'recycle';
};
