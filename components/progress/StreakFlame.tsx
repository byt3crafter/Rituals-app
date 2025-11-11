import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, interpolateColor } from 'react-native-reanimated';
import Icon from '../common/Icon';
import { theme } from '@/styles/theme';

interface StreakFlameProps {
  streak: number;
}

const StreakFlame: React.FC<StreakFlameProps> = ({ streak }) => {
  const scale = useSharedValue(1);
  const colorProgress = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1 + Math.min(streak / 20, 1) * 0.5, { damping: 15, stiffness: 100 });
    colorProgress.value = withSpring(Math.min(streak / 10, 1));
  }, [streak]);

  const animatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      colorProgress.value,
      [0, 1],
      [theme.colors.onSurfaceFaded, theme.colors.secondary]
    );
    return {
      transform: [{ scale: scale.value }],
      color: color,
    };
  });
  
  const animatedTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      colorProgress.value,
      [0, 1],
      [theme.colors.onSurface, theme.colors.onBase]
    ),
  }))

  return (
    <View style={styles.container}>
      <Animated.View style={[{ alignItems: 'center'}]}>
        <Icon name="flame" size={36} color={animatedStyle.color} />
      </Animated.View>
      <Animated.Text style={[styles.streakText, animatedTextStyle]}>
        {streak}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: theme.spacing.tiny,
  },
});

export default StreakFlame;
