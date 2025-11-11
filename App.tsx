
import React, { useState, useEffect } from 'react';
import { useFastingStore } from './store/useFastingStore';

import TimerScreen from './components/screens/TimerScreen';
import ProgressScreen from './components/screens/ProgressScreen';
import MentorScreen from './components/screens/MentorScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import TabBar from './components/navigation/TabBar';
import CompletionAnimation from './components/animations/CompletionAnimation';

import { Tab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('timer');
  const { state: fastingState, hydrate } = useFastingStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    hydrate().then(() => {
      setIsHydrated(true);
    });
  }, [hydrate]);

  const renderScreen = () => {
    switch (activeTab) {
      case 'timer':
        return <TimerScreen />;
      case 'progress':
        return <ProgressScreen />;
      case 'mentor':
        return <MentorScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <TimerScreen />;
    }
  };

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center h-screen bg-base">
        <p className="text-on-base">Loading Ritual...</p>
      </div>
    );
  }

  return (
    <div className="bg-base min-h-screen font-sans flex flex-col antialiased">
      <main className="flex-grow flex flex-col justify-center items-center p-4 pb-24">
        {fastingState === 'completed' && <CompletionAnimation />}
        {renderScreen()}
      </main>
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
