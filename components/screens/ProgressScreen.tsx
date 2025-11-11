
import React from 'react';
import { useFastingStore } from '../../store/useFastingStore';
import FastingChart from '../common/FastingChart';
import { FastingSession } from '../../types';

const calculateMetrics = (history: FastingSession[]) => {
  const totalFasts = history.length;
  const completedFasts = history.filter(s => s.completed).length;
  const disciplineScore = totalFasts > 0 ? Math.round((completedFasts / totalFasts) * 100) : 100;

  let streak = 0;
  const sortedHistory = [...history].sort((a, b) => b.startTime - a.startTime);
  for (const session of sortedHistory) {
    if (session.completed) {
      streak++;
    } else {
      break;
    }
  }

  return { disciplineScore, streak };
};

const ProgressScreen: React.FC = () => {
  const history = useFastingStore((s) => s.history);
  const { disciplineScore, streak } = calculateMetrics(history);

  return (
    <div className="w-full max-w-md p-4 text-center">
      <h1 className="text-2xl font-bold mb-6 text-on-base">Your Progress</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-surface p-4 rounded-lg">
          <p className="text-sm text-on-surface/70">Discipline</p>
          <p className="text-3xl font-bold text-primary">{disciplineScore}%</p>
        </div>
        <div className="bg-surface p-4 rounded-lg">
          <p className="text-sm text-on-surface/70">Streak</p>
          <p className="text-3xl font-bold text-secondary">{streak} Days</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2 text-on-base">7-Day History</h2>
      {history.length > 0 ? (
        <FastingChart data={history} />
      ) : (
        <p className="text-on-surface/70 mt-8">Complete a ritual to see your progress here.</p>
      )}
    </div>
  );
};

export default ProgressScreen;
