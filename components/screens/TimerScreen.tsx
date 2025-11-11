
import React, { useEffect, useState, useMemo } from 'react';
import { useFastingStore } from '../../store/useFastingStore';
import { FASTING_PLANS, MILESTONES } from '../../constants';
import CommitButton from '../common/CommitButton';
import { hapticFeedback } from '../../services/hapticsService';

const formatTime = (ms: number): string => {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const IdleView: React.FC = () => {
    const { selectedPlan, selectPlan, startCommitting } = useFastingStore();
    return (
        <div className="text-center flex flex-col items-center">
            <h1 className="text-3xl font-bold text-on-base">Choose Your Ritual</h1>
            <p className="mt-2 text-on-surface/70">Select a fasting plan to begin.</p>
            <div className="flex space-x-2 sm:space-x-4 mt-8">
                {FASTING_PLANS.map(plan => (
                    <button
                        key={plan.id}
                        onClick={() => selectPlan(plan)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 border-2 ${selectedPlan?.id === plan.id ? 'bg-primary border-primary text-base' : 'bg-surface border-surface hover:border-primary/50 text-on-surface'}`}
                    >
                        {plan.name}
                    </button>
                ))}
            </div>
            {selectedPlan && <CommitButton onCommit={startCommitting} onCancel={() => {}} />}
        </div>
    );
};

const ActiveView: React.FC = () => {
    const { endTime, selectedPlan, completeFasting, abortFasting, intentions, toggleIntention } = useFastingStore();
    const [remainingTime, setRemainingTime] = useState(endTime ? endTime - Date.now() : 0);
    const [lastHapticHour, setLastHapticHour] = useState(-1);

    useEffect(() => {
        const interval = setInterval(() => {
            const newRemaining = endTime ? endTime - Date.now() : 0;
            if (newRemaining <= 0) {
                completeFasting();
                clearInterval(interval);
            } else {
                setRemainingTime(newRemaining);

                const hoursElapsed = (selectedPlan!.durationHours * 3600000 - newRemaining) / 3600000;
                const currentHourMilestone = MILESTONES.slice().reverse().find(h => hoursElapsed >= h);
                if (currentHourMilestone !== undefined && currentHourMilestone > lastHapticHour) {
                    // FIX: Argument of type '100' is not assignable to parameter of type 'HapticFeedbackType'. Changed to a valid type.
                    hapticFeedback('medium');
                    setLastHapticHour(currentHourMilestone);
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [endTime, completeFasting, selectedPlan, lastHapticHour]);

    const totalDuration = selectedPlan!.durationHours * 60 * 60 * 1000;
    const elapsedTime = totalDuration - remainingTime;
    const progressPercentage = (elapsedTime / totalDuration) * 100;
    const elapsedHours = elapsedTime / (1000 * 60 * 60);

    const milestoneDots = useMemo(() => {
        return MILESTONES.map(hour => {
            if (hour > selectedPlan!.durationHours) return null;
            const position = (hour / selectedPlan!.durationHours) * 100;
            const isAchieved = elapsedHours >= hour;
            return (
                <div key={hour} style={{ left: `${position}%` }} className="absolute -top-1/2 transform -translate-x-1/2">
                    <div className={`w-3 h-3 rounded-full transition-colors duration-500 ${isAchieved ? 'bg-secondary' : 'bg-surface'}`}></div>
                    <span className={`absolute -bottom-6 text-xs transition-opacity duration-500 ${isAchieved ? 'text-secondary opacity-100' : 'text-on-surface/50 opacity-50'}`}>{hour}h</span>
                </div>
            );
        }).filter(Boolean);
    }, [selectedPlan, elapsedHours]);

    return (
        <div className="w-full max-w-md flex flex-col items-center">
            <p className="text-on-surface/70 text-lg">Time Remaining</p>
            <h1 className="text-6xl font-bold my-4 tabular-nums text-on-base">{formatTime(remainingTime)}</h1>
            <div className="w-full bg-surface rounded-full h-2.5 my-8 relative">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                {milestoneDots}
            </div>

            <div className="w-full text-left mt-8">
                <h2 className="text-xl font-semibold mb-2 text-on-base">Intentions</h2>
                 {intentions.map(intention => (
                    <div key={intention.id} onClick={() => toggleIntention(intention.id)} className="flex items-center p-2 cursor-pointer">
                        <div className={`w-5 h-5 rounded border-2 ${intention.completed ? 'bg-secondary border-secondary' : 'border-on-surface/50'}`}>
                            {intention.completed && <svg className="w-full h-full text-base" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                        </div>
                        <span className={`ml-3 ${intention.completed ? 'line-through text-on-surface/50' : 'text-on-surface'}`}>{intention.text}</span>
                    </div>
                ))}
            </div>

            <button onClick={() => {
                if(window.confirm('Are you sure you want to end your ritual early? This will break your streak.')){
                    abortFasting();
                }
            }} className="mt-8 text-sm text-red-400 opacity-70 hover:opacity-100">End Ritual Early</button>
        </div>
    );
};


const CommittingView: React.FC = () => {
    const { startFasting, cancelCommitting } = useFastingStore();
    return (
         <div className="text-center flex flex-col items-center">
             <h1 className="text-2xl font-semibold text-on-base">Prepare Your Mind.</h1>
             <p className="mt-2 text-on-surface/70">Focus on your intention.</p>
             <CommitButton onCommit={startFasting} onCancel={cancelCommitting} />
         </div>
    );
}

const AbortedView: React.FC = () => {
    const { resetToIdle } = useFastingStore();
    useEffect(() => {
        const timer = setTimeout(resetToIdle, 3000);
        return () => clearTimeout(timer);
    }, [resetToIdle]);

    return (
        <div className="text-center">
            <h1 className="text-2xl font-semibold text-red-400">Ritual Ended</h1>
            <p className="mt-2 text-on-surface/70">A new opportunity awaits.</p>
        </div>
    );
}


const TimerScreen: React.FC = () => {
  const { state } = useFastingStore();

  switch (state) {
    case 'active':
      return <ActiveView />;
    case 'committing':
        return <CommittingView />;
    case 'aborted':
        return <AbortedView />;
    case 'idle':
    case 'completed': // Completion animation is an overlay, so we show idle view underneath
    default:
      return <IdleView />;
  }
};

export default TimerScreen;