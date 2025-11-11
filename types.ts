export type FastingState = 'idle' | 'committing' | 'scheduled' | 'active' | 'completed' | 'aborted';

export type FastingPlan = {
  id: string;
  name: string;
  durationHours: number;
};

export type Intention = {
  id: number;
  text: string;
  completed: boolean;
};

export type FastingSession = {
  startTime: number;
  endTime: number;
  durationHours: number;
  completed: boolean;
};

export type Tab = 'timer' | 'progress' | 'mentor' | 'settings';

export type MentorMessage = {
  id: number;
  text: string;
  sender: 'user' | 'mentor';
  isLoading?: boolean;
};

export type MealChoice = 'breakfast' | 'lunch' | 'dinner';

export type MilestoneInfo = {
  hour: number;
  name: string;
  description: string;
  icon: 'droplet' | 'bolt' | 'key' | 'flame' | 'recycle';
};
