import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFastingStore } from '@/store/useFastingStore';
import { useEffect } from 'react';
import CompletionAnimation from '@/components/animations/CompletionAnimation';
import { theme } from '@/styles/theme';

export default function RootLayout() {
  const { state: fastingState, hydrate } = useFastingStore();
  
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.base } }} />
        {fastingState === 'completed' && <CompletionAnimation />}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}