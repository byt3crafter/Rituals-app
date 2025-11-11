import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RitualState, Ritual, RitualSession } from '@/types';

interface RitualStoreState {
  state: RitualState;
  activeRitual: Ritual | null;
  startTime: number | null;
  history: RitualSession[];
  
  // Actions
  startRitual: (ritual: Ritual) => void;
  completeRitual: () => void;
  abortRitual: () => void;
  resetToIdle: () => void;
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

export const useRitualStore = create<RitualStoreState>()(
  persist(
    (set, get) => ({
      state: 'idle',
      activeRitual: null,
      startTime: null,
      history: [],

      startRitual: (ritual) => {
        set({
          state: 'active',
          activeRitual: ritual,
          startTime: Date.now(),
        });
      },

      completeRitual: () => {
        const { startTime, activeRitual } = get();
        if (!startTime || !activeRitual) return;

        const newSession: RitualSession = {
          ritualId: activeRitual.id,
          ritualName: activeRitual.name,
          startTime,
          endTime: Date.now(),
          durationHours: activeRitual.durationHours,
          completed: true,
        };

        set((state) => ({
          state: 'completed',
          history: [...state.history, newSession],
        }));
      },
      
      abortRitual: () => {
         const { startTime, activeRitual } = get();
         if (!startTime || !activeRitual) {
            set({ state: 'idle', startTime: null, activeRitual: null });
            return;
         }

        const newSession: RitualSession = {
          ritualId: activeRitual.id,
          ritualName: activeRitual.name,
          startTime,
          endTime: Date.now(),
          durationHours: activeRitual.durationHours,
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
        activeRitual: null,
      }),
      
      hydrate: async () => {
        // This function is now just for explicit calls, middleware handles auto-hydration
      },
    }),
    {
      name: 'ritual-mastery-storage',
      storage: createJSONStorage(() => platformAwareStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.state === 'active' && state.activeRitual?.trackingMethod === 'timer') {
            const endTime = state.startTime! + state.activeRitual.durationHours! * 60 * 60 * 1000;
            if (endTime < Date.now()) {
                state.completeRitual();
            }
        }
      }
    }
  )
);
