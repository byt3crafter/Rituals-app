import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Switch, Pressable, Alert, Platform } from 'react-native';
import { requestNotificationPermission, scheduleDailyReminder, cancelAllNotifications } from '@/services/notificationService';
import { theme } from '@/styles/theme';

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date(new Date().setHours(20, 0, 0, 0))); // Default 8 PM

  useEffect(() => {
    // Check initial permission status on mount
    requestNotificationPermission(false).then(status => {
      setNotificationsEnabled(status === 'granted');
    });
  }, []);

  const handleNotificationToggle = async () => {
    if (!notificationsEnabled) {
      const permission = await requestNotificationPermission(true);
      const isGranted = permission === 'granted';
      setNotificationsEnabled(isGranted);
      if (isGranted) {
        scheduleDailyReminder(reminderTime.getHours(), reminderTime.getMinutes());
        Alert.alert("Reminders Enabled", `You will be reminded daily at ${reminderTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}.`);
      }
    } else {
      await cancelAllNotifications();
      setNotificationsEnabled(false);
      Alert.alert("Reminders Disabled", "You will no longer receive daily reminders.");
    }
  };

  // NOTE: A proper time picker would use a library like @react-native-community/datetimepicker
  // For this minimal example, we'll stick to a simple text display.
  const displayTime = reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>
        
        <View style={styles.settingCard}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Daily Reminder</Text>
            <Text style={styles.settingDescription}>Reminds you to start your ritual.</Text>
          </View>
          <Switch
            trackColor={{ false: theme.colors.surface, true: theme.colors.secondary }}
            thumbColor={notificationsEnabled ? theme.colors.base : theme.colors.onSurfaceFaded}
            ios_backgroundColor={theme.colors.surface}
            onValueChange={handleNotificationToggle}
            value={notificationsEnabled}
          />
        </View>

        {notificationsEnabled && (
           <View style={[styles.settingCard, styles.timeCard]}>
             <Text style={styles.settingDescription}>Reminder Time</Text>
             <Text style={styles.timeText}>{displayTime}</Text>
           </View>
        )}
      </View>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.onBase,
    textAlign: 'center',
    marginBottom: theme.spacing.large,
  },
  settingCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.large,
    borderRadius: theme.borderRadius.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  settingDescription: {
    fontSize: 14,
    color: theme.colors.onSurfaceFaded,
    marginTop: theme.spacing.tiny,
  },
  timeCard: {
      marginTop: theme.spacing.medium,
  },
  timeText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.primary,
  }
});

export default SettingsScreen;
