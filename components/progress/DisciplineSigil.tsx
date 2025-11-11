import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Defs, RadialGradient, Stop } from 'react-native-svg';
import Animated, { useSharedValue, withTiming, useAnimatedProps } from 'react-native-reanimated';
import { theme } from '@/styles/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface DisciplineSigilProps {
  score: number;
}

const DisciplineSigil: React.FC<DisciplineSigilProps> = ({ score }) => {
  const size = 80;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(score / 100, { duration: 1200 });
  }, [score]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - animatedProgress.value);
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
            <RadialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <Stop offset="0%" stopColor={theme.colors.primary} stopOpacity="0.7" />
                <Stop offset="100%" stopColor={theme.colors.secondary} stopOpacity="0.8" />
            </RadialGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.base}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedPath
          d={`M ${size / 2} ${strokeWidth / 2} A ${radius} ${radius} 0 1 1 ${size / 2 - 0.01} ${strokeWidth/2}`}
          stroke="url(#grad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
        />
      </Svg>
      <Text style={styles.scoreText}>{score}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    position: 'absolute',
    color: theme.colors.onBase,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DisciplineSigil;
