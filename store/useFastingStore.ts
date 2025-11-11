import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FastingState, FastingPlan, Intention, FastingSession, MealChoice } from '@/types';
import { DEFAULT_INTENTIONS } from '@/constants';

interface FastingStoreState {
  state: FastingState;
  selectedPlan: FastingPlan | null;
  eatingWindow: MealChoice | null;
  startTime: number | null;
  endTime: number | null;
  intentions: Intention[];
  history: FastingSession[];
  
  // Actions
  selectPlan: (plan: FastingPlan) => void;
  setEatingWindow: (window: MealChoice | null) => void;
  startCommitting: () => void;
  cancelCommitting: () => void;
  commitAndScheduleFasting: () => void;
  startNow: () => void;
  startScheduledFast: () => void;
  completeFasting: () => void;
  abortFasting: () => void;
  resetToIdle: () => void;
  toggleIntention: (id: number) => void;
  addIntention: (text: string) => void;
  hydrate: () => Promise<void>;
}

// Platform-aware storage
const platformAwareStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(name);
      }
      return await AsyncStorage.getItem(name);
    } catch (e) {
      console.warn(`[zustand persist middleware] Unable to get item '${name}'`, e);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        return localStorage.setItem(name, value);
      }
      await AsyncStorage.setItem(name, value);
    } catch(e) {
       console.warn(`[zustand persist middleware] Unable to set item '${name}'`, e);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
        if (Platform.OS === 'web') {
            return localStorage.removeItem(name);
        }
        await AsyncStorage.removeItem(name);
    } catch (e) {
        console.warn(`[zustand persist middleware] Unable to remove item '${name}'`, e);
    }
  },
};


export const useFastingStore = create<FastingStoreState>()(
  persist(
    (set, get) => ({
      state: 'idle',
      selectedPlan: null,
      eatingWindow: null,
      startTime: null,
      endTime: null,
      intentions: DEFAULT_INTENTIONS,
      history: [],

      selectPlan: (plan) => set({ selectedPlan: plan, eatingWindow: null, state: 'idle' }),
      
      setEatingWindow: (window) => set({ eatingWindow: window }),

      startCommitting: () => set({ state: 'committing' }),
      
      cancelCommitting: () => set({ state: 'idle' }),

      commitAndScheduleFasting: () => {
        const { selectedPlan } = get();
        if (!selectedPlan) return;

        const now = new Date();
        const scheduledStartTime = new Date(now);
        // Schedule for the beginning of the next hour
        scheduledStartTime.setHours(now.getHours() + 1, 0, 0, 0);

        const endTime = scheduledStartTime.getTime() + selectedPlan.durationHours * 60 * 60 * 1000;

        set({
          state: 'scheduled',
          startTime: scheduledStartTime.getTime(),
          endTime,
          intentions: DEFAULT_INTENTIONS,
        });
      },

      startNow: () => {
        const { selectedPlan } = get();
        if (!selectedPlan) return;
        const now = Date.now();
        const endTime = now + selectedPlan.durationHours * 60 * 60 * 1000;
        set({
          state: 'active',
          startTime: now,
          endTime,
        });
      },
      
      startScheduledFast: () => {
        set({ state: 'active' });
      },

      completeFasting: () => {
        const { startTime, selectedPlan } = get();
        if (!startTime || !selectedPlan) return;

        const newSession: FastingSession = {
          startTime,
          endTime: Date.now(),
          durationHours: selectedPlan.durationHours,
          completed: true,
        };

        set((state) => ({
          state: 'completed',
          history: [...state.history, newSession],
        }));
      },
      
      abortFasting: () => {
         const { startTime, selectedPlan } = get();
         if (!startTime || !selectedPlan) {
            set({ state: 'idle', startTime: null, endTime: null, selectedPlan: null, eatingWindow: null });
            return;
         }

        const newSession: FastingSession = {
          startTime,
          endTime: Date.now(),
          durationHours: selectedPlan.durationHours,
          completed: false,
        };
        
        set((state) => ({
            state: 'aborted',
            history: [...state.history, newSession],
        }));
      },

      resetToIdle: () => set({
        state: 'idle',
        startTime: null,
        endTime: null,
        selectedPlan: null,
        eatingWindow: null,
        intentions: DEFAULT_INTENTIONS,
      }),

      toggleIntention: (id) => set((state) => ({
        intentions: state.intentions.map((intention) =>
          intention.id === id ? { ...intention, completed: !intention.completed } : intention
        ),
      })),

      addIntention: (text) => set((state) => ({
        intentions: [
          ...state.intentions,
          { id: Date.now(), text, completed: false },
        ],
      })),
      
      hydrate: async () => {
        // This function is now just for explicit calls, middleware handles auto-hydration
      },
    }),
    {
      name: 'ritual-fasting-storage',
      storage: createJSONStorage(() => platformAwareStorage),
      onRehydrateStorage: () => (state) => {
          if (state?.state === 'active' && state.endTime && state.endTime < Date.now()) {
            state.completeFasting();
          }
           if (state?.state === 'scheduled' && state.startTime && state.startTime < Date.now()) {
            state.startScheduledFast();
          }
      }
    }
  )
);