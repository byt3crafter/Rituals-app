
import React from 'react';
import { Tab } from '../../types';
import Icon from '../common/Icon';

interface TabBarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: 'timer' | 'chart' | 'sparkles' | 'settings' }[] = [
  { id: 'timer', label: 'Ritual', icon: 'timer' },
  { id: 'progress', label: 'Progress', icon: 'chart' },
  { id: 'mentor', label: 'Mentor', icon: 'sparkles' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
];

const TabBar: React.FC<TabBarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-primary/20 shadow-lg z-10">
      <div className="flex justify-around max-w-lg mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center w-full pt-3 pb-2 transition-colors duration-200 focus:outline-none ${
              activeTab === tab.id ? 'text-primary' : 'text-on-surface/60 hover:text-on-surface'
            }`}
          >
            {/* FIX: Property 'className' does not exist on type 'IconProps'. Removed className and applied margin to the span below. */}
            <Icon name={tab.icon} />
            <span className="text-xs font-medium mt-1">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="w-8 h-1 bg-primary rounded-full mt-1"></div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default TabBar;