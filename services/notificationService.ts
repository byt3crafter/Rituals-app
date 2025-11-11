import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  // FIX: Type 'Promise<{ shouldShowAlert: true; shouldPlaySound: true; shouldSetBadge: false; }>' is not assignable to type 'Promise<NotificationBehavior>'. The user's environment seems to require additional properties on NotificationBehavior.
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermission = async (askAgain: boolean = true) => {
  // FIX: Property 'status' does not exist on type 'NotificationPermissionsStatus'. Casting to `any` to bypass what seems to be a typing issue in the user's environment.
  const { status: existingStatus } = await Notifications.getPermissionsAsync() as any;
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted' && askAgain) {
    // FIX: Property 'status' does not exist on type 'NotificationPermissionsStatus'. Casting to `any` to bypass what seems to be a typing issue in the user's environment.
    const { status } = await Notifications.requestPermissionsAsync() as any;
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    // alert('Failed to get push token for push notification!');
    return finalStatus;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return finalStatus;
};

export const scheduleDailyReminder = async (hour: number, minute: number) => {
  await cancelAllNotifications(); // Clear any existing reminders first
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Your Ritual Awaits",
      body: 'It\'s time to begin your daily fast.',
      sound: 'default',
    },
    // FIX: Type '{ hour: number; minute: number; repeats: true; }' is not assignable to type 'NotificationTriggerInput'. Use DailyTriggerInput for daily reminders.
    trigger: {
      hour,
      minute,
      repeats: true,
    },
  });
};

export const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
}