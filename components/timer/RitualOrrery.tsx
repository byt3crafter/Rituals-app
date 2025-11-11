import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import Animated, { useSharedValue, withTiming, useAnimatedProps } from 'react-native-reanimated';
import { theme } from '@/styles/theme';
import { MILESTONES } from '@/constants';
import { MilestoneInfo } from '@/types';
import Icon from '../common/Icon';
import { hapticFeedback } from '@/services/hapticsService';

interface RitualOrreryProps {
  progress: number;
  elapsedHours: number;
  totalHours: number;
  onMilestonePress: (milestone: MilestoneInfo) => void;
  timeValue: string;
}

const AnimatedPath = Animated.createAnimatedComponent(Path);

const RitualOrrery: React.FC<RitualOrreryProps> = ({ progress, elapsedHours, totalHours, onMilestonePress, timeValue }) => {
  const size = 250;
  const strokeWidth = 20; // Made the arc thicker and more substantial
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const milestoneOrbitRadius = radius + 22; // Place milestones outside the main arc

  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 1000 });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - animatedProgress.value);
    return {
      strokeDashoffset,
    };
  });
  
  const lastHapticHour = React.useRef(-1);
  useEffect(() => {
      const currentHourMilestone = MILESTONES.slice().reverse().find(m => elapsedHours >= m.hour);
      if(currentHourMilestone && currentHourMilestone.hour > lastHapticHour.current) {
          hapticFeedback('medium');
          lastHapticHour.current = currentHourMilestone.hour;
      }
  }, [elapsedHours]);

  const renderMilestones = () => {
    return MILESTONES.map((milestone) => {
      if (milestone.hour > totalHours) return null;
      
      const angle = (milestone.hour / totalHours) * 2 * Math.PI - Math.PI / 2;
      const x = milestoneOrbitRadius * Math.cos(angle) + size / 2;
      const y = milestoneOrbitRadius * Math.sin(angle) + size / 2;
      const isAchieved = elapsedHours >= milestone.hour;

      return (
        <Pressable
          key={milestone.hour}
          style={[styles.milestone, { left: x - 16, top: y - 16 }]}
          onPress={() => onMilestonePress(milestone)}
        >
            <View style={[styles.milestoneIconBg, isAchieved && styles.milestoneIconBgAchieved]}>
                <Icon name={milestone.icon} size={20} color={isAchieved ? theme.colors.base : theme.colors.onSurfaceFaded} />
            </View>
        </Pressable>
      );
    });
  };
  
  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme.colors.surface}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Arc */}
        <AnimatedPath
          d={`M ${size / 2} ${strokeWidth / 2} A ${radius} ${radius} 0 1 1 ${size / 2 - 0.01} ${strokeWidth/2}`}
          stroke={theme.colors.primary}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
        />
        
        {/* "Remaining" Label */}
        <SvgText
          x={size / 2}
          y={size / 2 - 20}
          textAnchor="middle"
          fontSize="12"
          fill={theme.colors.onSurfaceFaded}
          opacity={0.7}
        >
          Time Remaining
        </SvgText>
        
        {/* Centered Monospaced Timer */}
        <SvgText
          x={size / 2}
          y={size / 2 + 12}
          textAnchor="middle"
          fontFamily="monospace"
          fontSize="32"
          fontWeight="bold"
          fill={theme.colors.onBase}
        >
          {timeValue}
        </SvgText>
      </Svg>
      {renderMilestones()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 250,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.large,
  },
  milestone: {
    position: 'absolute',
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestoneIconBg: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.colors.base,
  },
  milestoneIconBgAchieved: {
      backgroundColor: theme.colors.secondary, // "Illuminated" state
  }
});

export default RitualOrrery;
