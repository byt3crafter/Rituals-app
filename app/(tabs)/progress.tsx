import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRitualStore } from '@/store/useRitualStore';
import FastingChart from '@/components/common/FastingChart';
import { RitualSession } from '@/types';
import { theme } from '@/styles/theme';
import DisciplineSigil from '@/components/progress/DisciplineSigil';
import StreakFlame from '@/components/progress/StreakFlame';

const calculateMetrics = (history: RitualSession[]) => {
  const totalRituals = history.length;
  const completedRituals = history.filter(s => s.completed).length;
  const disciplineScore = totalRituals > 0 ? Math.round((completedRituals / totalRituals) * 100) : 100;

  let streak = 0;
  const sortedHistory = [...history].sort((a, b) => b.startTime - a.startTime);
  for (const session of sortedHistory) {
    if (session.completed) {
      streak++;
    } else {
      break;
    }
  }
  
  const timerHistory = history.filter(s => s.durationHours !== undefined);

  const totalHours = timerHistory.reduce((acc, s) => {
    if (s.completed) {
        return acc + s.durationHours!;
    }
    const actualDuration = (s.endTime - s.startTime) / (1000 * 60 * 60);
    return acc + actualDuration;
  }, 0);

  const longestFast = timerHistory.reduce((max, s) => s.completed && s.durationHours! > max ? s.durationHours! : max, 0);

  return { disciplineScore, streak, totalHours: Math.floor(totalHours), longestFast, ritualsCompleted: completedRituals, fastingHistory: timerHistory };
};

const ProgressScreen = () => {
  const history = useRitualStore((s) => s.history);
  const { disciplineScore, streak, totalHours, longestFast, ritualsCompleted, fastingHistory } = calculateMetrics(history);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Hall of Records</Text>
        
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Discipline</Text>
            <DisciplineSigil score={disciplineScore} />
          </View>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Streak</Text>
            <StreakFlame streak={streak} />
          </View>
        </View>

        <View style={styles.recordsContainer}>
          <Text style={styles.sectionTitle}>Personal Records</Text>
           <View style={styles.recordRow}>
            <Text style={styles.recordLabel}>Rituals Completed</Text>
            <Text style={styles.recordValue}>{ritualsCompleted}</Text>
          </View>
          {fastingHistory.length > 0 && (
            <>
                <View style={styles.recordRow}>
                    <Text style={styles.recordLabel}>Total Hours in Ritual</Text>
                    <Text style={styles.recordValue}>{totalHours}</Text>
                </View>
                <View style={styles.recordRow}>
                    <Text style={styles.recordLabel}>Deepest Fast</Text>
                    <Text style={styles.recordValue}>{longestFast}h</Text>
                </View>
            </>
          )}
        </View>
        
        {fastingHistory.length > 0 && (
            <>
                <Text style={styles.sectionTitle}>7-Day Fasting History</Text>
                <FastingChart data={fastingHistory as any} /> 
            </>
        )}

        {history.length === 0 && (
            <Text style={styles.noDataText}>Complete a ritual to see your progress here.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.base,
  },
  content: {
    padding: theme.spacing.large,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.onBase,
    marginBottom: theme.spacing.large,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.medium,
    marginBottom: theme.spacing.xlarge,
  },
  metricCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    alignItems: 'center',
    height: 120,
    justifyContent: 'center',
  },
  metricLabel: {
    fontSize: 14,
    color: theme.colors.onSurfaceFaded,
    marginBottom: theme.spacing.small,
    fontWeight: '600'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.onBase,
    marginBottom: theme.spacing.medium,
    alignSelf: 'flex-start',
    marginTop: theme.spacing.medium,
  },
  noDataText: {
    color: theme.colors.onSurfaceFaded,
    marginTop: theme.spacing.xlarge,
  },
  recordsContainer: {
    width: '100%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.large,
    marginBottom: theme.spacing.xlarge,
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.base
  },
  recordLabel: {
    color: theme.colors.onSurface,
    fontSize: 16,
  },
  recordValue: {
    color: theme.colors.onBase,
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default ProgressScreen;
