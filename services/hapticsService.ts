import * as Haptics from 'expo-haptics';

type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export const hapticFeedback = (type: HapticFeedbackType = 'light') => {
  try {
    switch(type) {
        case 'light':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
        case 'medium':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            break;
        case 'heavy':
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            break;
        case 'success':
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
        case 'warning':
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            break;
        case 'error':
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            break;
    }
  } catch (error) {
      console.warn('Haptic feedback failed.', error);
  }
};
