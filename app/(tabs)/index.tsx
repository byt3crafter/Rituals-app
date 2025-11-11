import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Alert, ScrollView } from 'react-native';
import { useFastingStore } from '@/store/useFastingStore';
import { FASTING_PLANS } from '@/constants';
import CommitButton from '@/components/common/CommitButton';
import { theme } from '@/styles/theme';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { MealChoice, MilestoneInfo } from '@/types';
import RitualOrrery from '@/components/timer/RitualOrrery';
import MilestoneDetail from '@/components/timer/MilestoneDetail';

const formatTime = (ms: number): string => {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' });
}

const IdleView: React.FC = () => {
    const { selectedPlan, selectPlan, commitAndScheduleFasting, eatingWindow, setEatingWindow } = useFastingStore();
    
    const isOmad = selectedPlan?.id === 'omad';
    const mealOptions: MealChoice[] = isOmad ? ['breakfast', 'lunch', 'dinner'] : ['breakfast', 'dinner'];
    
    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.centerContainer}>
            <Text style={styles.title}>Choose Your Ritual</Text>
            <Text style={styles.subtitle}>Select a fasting plan to begin.</Text>
            <View style={styles.planContainer}>
                {FASTING_PLANS.map(plan => (
                    <Pressable
                        key={plan.id}
                        onPress={() => selectPlan(plan)}
                        style={[styles.planButton, selectedPlan?.id === plan.id && styles.planButtonSelected]}
                    >
                        <Text style={[styles.planButtonText, selectedPlan?.id === plan.id && styles.planButtonTextSelected]}>
                            {plan.name}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {selectedPlan && (
                <Animated.View layout={Layout.springify()} entering={FadeIn.delay(200)} style={styles.mealChoiceContainer}>
                    <Text style={styles.subtitle}>
                        {isOmad ? 'When is your one meal?' : 'Which meal will you skip?'}
                    </Text>
                    <View style={styles.planContainer}>
                        {mealOptions.map(option => (
                            <Pressable
                                key={option}
                                onPress={() => setEatingWindow(option)}
                                style={[styles.planButton, eatingWindow === option && styles.planButtonSelected]}
                            >
                                <Text style={[styles.planButtonText, eatingWindow === option && styles.planButtonTextSelected]}>
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </Animated.View>
            )}

            {selectedPlan && eatingWindow && <CommitButton onCommit={commitAndScheduleFasting} onCancel={() => {}} />}
        </Animated.View>
    );
};

const ScheduledView: React.FC = () => {
    const { startTime, startNow, resetToIdle, startScheduledFast } = useFastingStore();
    const [timeToStart, setTimeToStart] = useState(startTime ? startTime - Date.now() : 0);

    useEffect(() => {
        if (!startTime) return;
        const interval = setInterval(() => {
            const newTimeToStart = startTime - Date.now();
            if (newTimeToStart <= 0) {
                startScheduledFast();
                clearInterval(interval);
            } else {
                setTimeToStart(newTimeToStart);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime, startScheduledFast]);
    
    return (
        <Animated.View entering={FadeIn} style={styles.centerContainer}>
            <Text style={styles.subtitle}>Your ritual begins in</Text>
            <Text style={styles.timerText}>{formatTime(timeToStart)}</Text>
            <Text style={styles.statusText}>Scheduled to start at {formatDate(startTime!)}</Text>

            <View style={styles.buttonGroup}>
                <Pressable onPress={startNow} style={[styles.actionButton, styles.primaryButton]}>
                    <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Start Now</Text>
                </Pressable>
                <Pressable onPress={resetToIdle} style={[styles.actionButton, styles.secondaryButton]}>
                    <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Cancel</Text>
                </Pressable>
            </View>
        </Animated.View>
    );
};


const FastingStatus: React.FC<{startTime: number; endTime: number}> = ({ startTime, endTime }) => (
    <View style={styles.statusContainer}>
        <View style={styles.statusBlock}>
            <Text style={styles.statusLabel}>Started</Text>
            <Text style={styles.statusValue}>{formatDate(startTime)}</Text>
        </View>
        <View style={styles.statusBlock}>
            <Text style={styles.statusLabel}>Ends</Text>
            <Text style={styles.statusValue}>{formatDate(endTime)}</Text>
        </View>
    </View>
);

const ActiveView: React.FC = () => {
    const { startTime, endTime, selectedPlan, completeFasting, abortFasting } = useFastingStore();
    const [remainingTime, setRemainingTime] = useState(endTime ? endTime - Date.now() : 0);
    const [selectedMilestone, setSelectedMilestone] = useState<MilestoneInfo | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const newRemaining = endTime ? endTime - Date.now() : 0;
            if (newRemaining <= 0) {
                completeFasting();
                clearInterval(interval);
            } else {
                setRemainingTime(newRemaining);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [endTime, completeFasting]);

    const totalDuration = selectedPlan!.durationHours * 60 * 60 * 1000;
    const elapsedTime = totalDuration - remainingTime;
    const progressPercentage = (elapsedTime / totalDuration);
    
    const handleMilestonePress = (milestone: MilestoneInfo) => {
        setSelectedMilestone(milestone === selectedMilestone ? null : milestone);
    }

    return (
        <Animated.View entering={FadeIn} style={styles.activeContainer}>
            <FastingStatus startTime={startTime!} endTime={endTime!} />
            
            <RitualOrrery
                progress={progressPercentage}
                elapsedHours={elapsedTime / (1000 * 60 * 60)}
                totalHours={selectedPlan!.durationHours}
                onMilestonePress={handleMilestonePress}
                timeLabel="Time Remaining"
                timeValue={formatTime(remainingTime)}
            />

            <MilestoneDetail milestone={selectedMilestone} />

            <Pressable style={styles.endRitualButton} onPress={() => {
                Alert.alert(
                    'End Ritual Early?',
                    'This will break your streak. Are you sure you want to end your fast?',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'End Ritual', style: 'destructive', onPress: abortFasting }
                    ]
                )
            }}>
                <Text style={styles.endRitualText}>End Ritual Early</Text>
            </Pressable>
        </Animated.View>
    );
};


const CommittingView: React.FC = () => {
    const { commitAndScheduleFasting, resetToIdle } = useFastingStore();
    return (
         <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.centerContainer}>
             <Text style={styles.title}>Prepare Your Mind.</Text>
             <Text style={styles.subtitle}>Focus on your intention.</Text>
             <CommitButton onCommit={commitAndScheduleFasting} onCancel={resetToIdle} />
         </Animated.View>
    );
}

const AbortedView: React.FC = () => {
    const { resetToIdle } = useFastingStore();
    useEffect(() => {
        const timer = setTimeout(resetToIdle, 3000);
        return () => clearTimeout(timer);
    }, [resetToIdle]);

    return (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.centerContainer}>
            <Text style={[styles.title, { color: theme.colors.error }]}>Ritual Ended</Text>
            <Text style={styles.subtitle}>A new opportunity awaits.</Text>
        </Animated.View>
    );
}


const TimerScreen: React.FC = () => {
  const { state } = useFastingStore();

  const renderContent = () => {
    switch (state) {
        case 'scheduled':
          return <ScheduledView />;
        case 'active':
          return <ActiveView />;
        case 'committing':
            return <CommittingView />;
        case 'aborted':
            return <AbortedView />;
        case 'idle':
        case 'completed': // Completion animation is an overlay, show idle view underneath
        default:
          return <IdleView />;
      }
  }

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.content}>
            {renderContent()}
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.base },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: theme.spacing.large },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  activeContainer: { flex: 1, justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingTop: theme.spacing.xlarge, paddingBottom: theme.spacing.medium },
  title: { fontSize: 28, fontWeight: 'bold', color: theme.colors.onBase, textAlign: 'center' },
  subtitle: { fontSize: 16, color: theme.colors.onSurfaceFaded, marginTop: theme.spacing.small, textAlign: 'center' },
  planContainer: { flexDirection: 'row', marginTop: theme.spacing.large, gap: theme.spacing.medium, flexWrap: 'wrap', justifyContent: 'center' },
  planButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: theme.borderRadius.medium, backgroundColor: theme.colors.surface, borderWidth: 2, borderColor: theme.colors.surface },
  planButtonSelected: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  planButtonText: { color: theme.colors.onSurface, fontWeight: '600' },
  planButtonTextSelected: { color: theme.colors.base },
  mealChoiceContainer: { width: '100%', alignItems: 'center', marginTop: theme.spacing.large },
  statusContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    paddingHorizontal: theme.spacing.medium, 
    paddingVertical: theme.spacing.small, 
    backgroundColor: theme.colors.surface, 
    borderRadius: theme.borderRadius.medium,
    marginTop: theme.spacing.xlarge || 24 // Added top margin to push down from status bar
  },
  statusBlock: { alignItems: 'center' },
  statusLabel: { color: theme.colors.onSurfaceFaded, fontSize: 12 },
  statusValue: { color: theme.colors.onBase, fontSize: 14, fontWeight: '600' },
  timerText: { fontSize: 52, fontWeight: 'bold', color: theme.colors.onBase, fontFamily: 'monospace', textAlign: 'center' },
  statusText: { color: theme.colors.onSurfaceFaded, fontSize: 16, marginTop: theme.spacing.small },
  buttonGroup: { flexDirection: 'row', marginTop: theme.spacing.xlarge, gap: theme.spacing.medium },
  actionButton: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: theme.borderRadius.full },
  primaryButton: { backgroundColor: theme.colors.primary },
  secondaryButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.colors.onSurfaceFaded },
  actionButtonText: { fontSize: 16, fontWeight: 'bold' },
  primaryButtonText: { color: theme.colors.base },
  secondaryButtonText: { color: theme.colors.onSurfaceFaded },
  endRitualButton: { padding: theme.spacing.medium },
  endRitualText: { color: theme.colors.error, opacity: 0.7 }
});

export default TimerScreen;