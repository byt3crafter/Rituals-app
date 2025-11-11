import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Alert, ScrollView } from 'react-native';
import { useRitualStore } from '@/store/useRitualStore';
import { RITUALS } from '@/constants';
import { theme } from '@/styles/theme';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Ritual, MilestoneInfo, RitualCategory } from '@/types';
import RitualOrrery from '@/components/timer/RitualOrrery';
import MilestoneDetail from '@/components/timer/MilestoneDetail';

// --- Helper Components ---
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

// --- Views ---

const IdleView: React.FC = () => {
    const { startRitual } = useRitualStore();
    const categories: RitualCategory[] = ['Body', 'Mind', 'Spirit'];

    return (
        <ScrollView style={{width: '100%'}} contentContainerStyle={styles.idleContainer}>
            <Text style={styles.title}>The Crossroads</Text>
            <Text style={styles.subtitle}>Choose a domain to cultivate.</Text>
            
            {categories.map(category => (
                <View key={category} style={styles.categoryContainer}>
                    <Text style={styles.categoryTitle}>{category}</Text>
                    {RITUALS.filter(r => r.category === category).map(ritual => (
                        <Pressable key={ritual.id} style={styles.ritualCard} onPress={() => startRitual(ritual)}>
                            <Text style={styles.ritualName}>{ritual.name}</Text>
                            <Text style={styles.ritualIntention}>{ritual.intention}</Text>
                        </Pressable>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
};

const TimerBasedActiveView: React.FC<{ ritual: Ritual }> = ({ ritual }) => {
    const { startTime, completeRitual, abortRitual } = useRitualStore();
    const endTime = useMemo(() => startTime! + ritual.durationHours! * 60 * 60 * 1000, [startTime, ritual]);
    const [remainingTime, setRemainingTime] = useState(endTime - Date.now());
    const [selectedMilestone, setSelectedMilestone] = useState<MilestoneInfo | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            const newRemaining = endTime - Date.now();
            if (newRemaining <= 0) {
                completeRitual();
                clearInterval(interval);
            } else {
                setRemainingTime(newRemaining);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [endTime, completeRitual]);

    const totalDuration = ritual.durationHours! * 60 * 60 * 1000;
    const elapsedTime = totalDuration - remainingTime;
    const progressPercentage = (elapsedTime / totalDuration);
    
    const handleMilestonePress = (milestone: MilestoneInfo) => {
        setSelectedMilestone(milestone === selectedMilestone ? null : milestone);
    }

    return (
         <View style={styles.activeContainer}>
            <View style={styles.statusContainer}>
                <View style={styles.statusBlock}>
                    <Text style={styles.statusLabel}>Started</Text>
                    <Text style={styles.statusValue}>{formatDate(startTime!)}</Text>
                </View>
                <View style={styles.statusBlock}>
                    <Text style={styles.statusLabel}>Ends</Text>
                    <Text style={styles.statusValue}>{formatDate(endTime)}</Text>
                </View>
            </View>
            
            <RitualOrrery
                progress={progressPercentage}
                elapsedHours={elapsedTime / (1000 * 60 * 60)}
                totalHours={ritual.durationHours!}
                onMilestonePress={handleMilestonePress}
                timeValue={formatTime(remainingTime)}
            />

            <MilestoneDetail milestone={selectedMilestone} />

            <Pressable style={styles.endRitualButton} onPress={() => {
                Alert.alert('End Ritual Early?', 'Are you sure you want to end this ritual?',
                    [{ text: 'Cancel', style: 'cancel' }, { text: 'End Ritual', style: 'destructive', onPress: abortRitual }]
                )
            }}>
                <Text style={styles.endRitualText}>End Ritual Early</Text>
            </Pressable>
        </View>
    );
}

const CheckInActiveView: React.FC<{ ritual: Ritual }> = ({ ritual }) => {
    const { completeRitual, abortRitual } = useRitualStore();
    return (
        <View style={styles.centerContainer}>
            <Text style={styles.title}>{ritual.name}</Text>
            <Text style={[styles.subtitle, styles.checkInIntention]}>{ritual.intention}</Text>
            
            <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={completeRitual}>
                <Text style={[styles.actionButtonText, styles.primaryButtonText]}>Mark as Practiced</Text>
            </Pressable>

            <Pressable style={styles.endRitualButton} onPress={abortRitual}>
                <Text style={styles.endRitualText}>Cancel Ritual</Text>
            </Pressable>
        </View>
    );
}

const ActiveView: React.FC = () => {
    const { activeRitual } = useRitualStore();

    if (!activeRitual) return null;

    if (activeRitual.trackingMethod === 'timer') {
        return <TimerBasedActiveView ritual={activeRitual} />;
    }
    
    if (activeRitual.trackingMethod === 'check-in') {
        return <CheckInActiveView ritual={activeRitual} />;
    }

    return <Text style={styles.subtitle}>Unknown Ritual Type</Text>;
}


const AbortedView: React.FC = () => {
    const { resetToIdle } = useRitualStore();
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


const RitualScreen: React.FC = () => {
  const { state } = useRitualStore();

  const renderContent = () => {
    switch (state) {
        case 'active':
          return <ActiveView />;
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
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', paddingVertical: theme.spacing.large },
  idleContainer: { alignItems: 'center', padding: theme.spacing.large, width: '100%' },
  activeContainer: { flex: 1, justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingTop: theme.spacing.large, paddingBottom: theme.spacing.medium },
  title: { fontSize: 28, fontWeight: 'bold', color: theme.colors.onBase, textAlign: 'center' },
  subtitle: { fontSize: 16, color: theme.colors.onSurfaceFaded, marginTop: theme.spacing.small, textAlign: 'center', marginBottom: theme.spacing.large },
  categoryContainer: { width: '100%', marginBottom: theme.spacing.xlarge },
  categoryTitle: { fontSize: 22, fontWeight: '600', color: theme.colors.primary, marginBottom: theme.spacing.medium },
  ritualCard: { backgroundColor: theme.colors.surface, padding: theme.spacing.medium, borderRadius: theme.borderRadius.medium, marginBottom: theme.spacing.medium },
  ritualName: { color: theme.colors.onSurface, fontSize: 18, fontWeight: 'bold' },
  ritualIntention: { color: theme.colors.onSurfaceFaded, fontSize: 14, marginTop: theme.spacing.tiny },
  statusContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: theme.spacing.medium, paddingVertical: theme.spacing.small, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.medium, marginTop: theme.spacing.medium },
  statusBlock: { alignItems: 'center' },
  statusLabel: { color: theme.colors.onSurfaceFaded, fontSize: 12 },
  statusValue: { color: theme.colors.onBase, fontSize: 14, fontWeight: '600' },
  endRitualButton: { padding: theme.spacing.medium, marginTop: 'auto' },
  endRitualText: { color: theme.colors.error, opacity: 0.7 },
  checkInIntention: { paddingHorizontal: theme.spacing.large, marginBottom: theme.spacing.xlarge, lineHeight: 22 },
  actionButton: { paddingVertical: 16, paddingHorizontal: 32, borderRadius: theme.borderRadius.full },
  primaryButton: { backgroundColor: theme.colors.primary },
  actionButtonText: { fontSize: 18, fontWeight: 'bold' },
  primaryButtonText: { color: theme.colors.base },
});

export default RitualScreen;
