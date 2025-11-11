import { Ritual, MilestoneInfo } from './types';

export const RITUALS: Ritual[] = [
  // Body Rituals
  {
    id: 'fasting-16-8',
    name: '16:8 Fasting',
    category: 'Body',
    intention: 'To build discipline and improve metabolic health through intermittent fasting.',
    trackingMethod: 'timer',
    durationHours: 16,
  },
  {
    id: 'omad',
    name: 'OMAD',
    category: 'Body',
    intention: 'One Meal A Day for deep metabolic reset and heightened discipline.',
    trackingMethod: 'timer',
    durationHours: 23,
  },

  // Mind Rituals
  {
    id: 'stoic-pause',
    name: 'The Stoic Pause',
    category: 'Mind',
    intention: 'When angered or agitated, pause and breathe before responding to cultivate tranquility.',
    trackingMethod: 'check-in',
  },
  {
    id: 'deep-work-90',
    name: 'Deep Work Block',
    category: 'Mind',
    intention: 'Commit to 90 minutes of single-tasked focus with zero distractions.',
    trackingMethod: 'timer',
    durationHours: 1.5,
  },

  // Spirit Rituals
  {
    id: 'digital-sunset',
    name: 'Digital Sunset',
    category: 'Spirit',
    intention: 'Disconnect from all screens one hour before bed to improve sleep and presence.',
    trackingMethod: 'check-in',
  },
  {
    id: 'morning-intention',
    name: 'Morning Intention',
    category: 'Spirit',
    intention: 'Upon waking, define the single most important goal for the day ahead.',
    trackingMethod: 'check-in',
  },
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
