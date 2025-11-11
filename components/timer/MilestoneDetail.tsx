import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { MilestoneInfo } from '@/types';
import { theme } from '@/styles/theme';
import Icon from '../common/Icon';

interface MilestoneDetailProps {
  milestone: MilestoneInfo | null;
}

const MilestoneDetail: React.FC<MilestoneDetailProps> = ({ milestone }) => {
  if (!milestone) {
    return <View style={styles.placeholder} />;
  }

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={styles.container}
    >
      <View style={styles.titleContainer}>
        <Icon name={milestone.icon} size={20} color={theme.colors.primary} />
        <Text style={styles.title}>{milestone.name}</Text>
      </View>
      <Text style={styles.description}>{milestone.description}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  placeholder: {
    height: 100,
    width: '100%',
  },
  container: {
    minHeight: 100,
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium || 16, // Reduced padding
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.medium || 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginLeft: theme.spacing.small,
  },
  description: {
    fontSize: 14,
    color: theme.colors.onSurface,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default MilestoneDetail;