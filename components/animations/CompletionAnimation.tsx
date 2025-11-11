import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useFastingStore } from '@/store/useFastingStore';
import { playCompletionSound } from '@/services/soundService';
import { hapticFeedback } from '@/services/hapticsService';
import { theme } from '@/styles/theme';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

const CompletionAnimation: React.FC = () => {
  const resetToIdle = useFastingStore((s) => s.resetToIdle);

  useEffect(() => {
    playCompletionSound();
    hapticFeedback('success');

    const timer = setTimeout(() => {
      resetToIdle();
    }, 4000); // Animation duration + buffer

    return () => clearTimeout(timer);
  }, [resetToIdle]);

  return (
    <View style={styles.container}>
        <Animated.View entering={FadeInDown.duration(600)}>
            <Text style={styles.title}>Ritual Complete</Text>
        </Animated.View>
        <Animated.View style={styles.lottieContainer} entering={ZoomIn.duration(800).delay(200)}>
            <LottieView
                source={{ uri: 'https://assets9.lottiefiles.com/packages/lf20_touohxv0.json' }}
                autoPlay
                loop={false}
                style={styles.lottie}
            />
        </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 18, 18, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.medium,
  },
  lottieContainer: {
      width: 256,
      height: 256,
  },
  lottie: {
    width: '100%',
    height: '100%',
  }
});

export default CompletionAnimation;
