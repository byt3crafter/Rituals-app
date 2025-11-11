
import React, { useState, useEffect } from 'react';
import { requestNotificationPermission, scheduleDailyReminder } from '../../services/notificationService';

const SettingsScreen: React.FC = () => {
  const [notificationStatus, setNotificationStatus] = useState(Notification.permission);
  const [reminderTime, setReminderTime] = useState('20:00');

  useEffect(() => {
    setNotificationStatus(Notification.permission);
  }, []);

  const handleNotificationToggle = async () => {
    if (notificationStatus !== 'granted') {
      const permission = await requestNotificationPermission();
      setNotificationStatus(permission);
      if (permission === 'granted') {
        const [hour, minute] = reminderTime.split(':').map(Number);
        scheduleDailyReminder(hour, minute);
      }
    } else {
      // In a real app, you would need logic to "turn off" notifications,
      // likely managed in a service worker. Here we just update the UI state.
      alert("Notifications are disabled. To re-enable, you may need to adjust your browser settings for this site.");
      // This is a simplification; true disabling is complex.
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReminderTime(e.target.value);
    if (notificationStatus === 'granted') {
      const [hour, minute] = e.target.value.split(':').map(Number);
      scheduleDailyReminder(hour, minute);
    }
  }

  return (
    <div className="w-full max-w-md p-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-on-base">Settings</h1>
      
      <div className="bg-surface p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-on-surface">Daily Reminder</h2>
            <p className="text-sm text-on-surface/70">Reminds you to start your ritual.</p>
          </div>
          <button
            onClick={handleNotificationToggle}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              notificationStatus === 'granted'
                ? 'bg-secondary text-base'
                : 'bg-primary text-base'
            }`}
          >
            {notificationStatus === 'granted' ? 'Enabled' : 'Enable'}
          </button>
        </div>

        {notificationStatus === 'granted' && (
           <div className="mt-4 pt-4 border-t border-on-surface/20">
             <label htmlFor="reminderTime" className="block text-sm font-medium text-on-surface/70 mb-2">
               Reminder Time
             </label>
             <input
              id="reminderTime"
              type="time"
              value={reminderTime}
              onChange={handleTimeChange}
              className="w-full bg-base p-2 rounded-md border border-on-surface/30 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
           </div>
        )}
      </div>
    </div>
  );
};

export default SettingsScreen;
