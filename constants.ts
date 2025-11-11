import { FastingPlan, MilestoneInfo } from './types';

export const FASTING_PLANS: FastingPlan[] = [
  { id: '16:8', name: '16:8', durationHours: 16 },
  { id: '18:6', name: '18:6', durationHours: 18 },
  { id: '20:4', name: '20:4', durationHours: 20 },
  { id: 'omad', name: 'OMAD', durationHours: 23 }, // One Meal A Day, typically 23:1
];

export const DEFAULT_INTENTIONS = [
  { id: 1, text: 'Stay hydrated', completed: false },
  { id: 2, text: 'Be mindful of my body', completed: false },
  { id: 3, text: 'Embrace the clarity', completed: false },
];

export const MILESTONES: MilestoneInfo[] = [
  {
    hour: 4,
    name: 'The Stillness',
    description: 'Insulin levels begin to fall, signaling your body to start switching from burning glucose to burning fat.',
    icon: 'droplet',
  },
  {
    hour: 8,
    name: 'The Gateway',
    description: 'Blood sugar normalizes as your body depletes its glycogen stores, reducing inflammation.',
    icon: 'key',
  },
  {
    hour: 12,
    name: 'The Spark',
    description: 'Fat burning (lipolysis) begins, and your body starts producing a small number of ketones.',
    icon: 'flame',
  },
  {
    hour: 16,
    name: 'The Renewal',
    description: 'Autophagy, the body\'s cellular cleaning process, significantly ramps up, removing old and damaged cells.',
    icon: 'recycle',
  },
  {
    hour: 20,
    name: 'The Ascent',
    description: 'Ketosis deepens, enhancing mental clarity and focus as your brain uses ketones for energy.',
    icon: 'bolt',
  },
];
