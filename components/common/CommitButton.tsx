import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { hapticFeedback } from '@/services/hapticsService';
import { theme } from '@/styles/theme';

interface CommitButtonProps {
  onCommit: () => void;
  onCancel: () => void;
}

const COMMIT_DURATION = 1500; // 1.5 seconds

const CommitButton: React.FC<CommitButtonProps> = ({ onCommit, onCancel }) => {
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);
  const isHolding = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: progress.value }],
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const longPressGesture = Gesture.LongPress()
    .minDuration(COMMIT_DURATION)
    .onStart(() => {
        isHolding.value = true;
        runOnJS(hapticFeedback)('light');
        scale.value = withTiming(0.95, { duration: 200 });
        progress.value = withTiming(1, { duration: COMMIT_DURATION });
    })
    .onEnd((_, success) => {
        if (success) {
            runOnJS(onCommit)();
            runOnJS(hapticFeedback)('success');
        } else {
            runOnJS(onCancel)();
        }
        isHolding.value = false;
        progress.value = withTiming(0, { duration: 200 });
        scale.value = withTiming(1, { duration: 200 });
    });

  return (
    <View style={styles.container}>
        <GestureDetector gesture={longPressGesture}>
            <Animated.View style={[styles.button, animatedContainerStyle]}>
                <Animated.View style={[styles.progress, animatedStyle]} />
                <Text style={styles.text}>Begin</Text>
            </Animated.View>
        </GestureDetector>
        <Text style={styles.label}>Press and hold to commit</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: theme.spacing.xlarge,
  },
  button: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: `${theme.colors.primary}80`, // 50% opacity
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `${theme.colors.primary}4D`, // 30% opacity
    borderRadius: 48,
  },
  text: {
    zIndex: 1,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: theme.colors.onSurface,
  },
  label: {
    marginTop: theme.spacing.medium,
    fontSize: 12,
    color: `${theme.colors.onSurface}B3`, // 70% opacity
  },
});

export default CommitButton;
