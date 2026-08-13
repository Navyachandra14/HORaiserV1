import React, { useState } from 'react';
import { DayRecord, Top3Item, FocusBlock } from '../types';
import { ProtectedFocusRunner } from '../components/ProtectedFocusRunner';
import { AffirmationComponent } from '../components/AffirmationComponent';
import { getStateVibrationLabel } from '../rules/stateRules';
import { computeTop3Progress, formatFriendlyDate } from '../rules/dailyRules';
import {
  Clock,
  TrendingUp,
  ShieldAlert,
  Lightbulb,
  RotateCcw,
  Plus,
  CheckCircle2,
  Circle,
  Zap,
  Target,
  Sparkles,
  ArrowUpRight,
  Play,
  Check,
  Flame,
  AlertCircle
} from 'lucide-react';

interface CommandCenterPageProps {
  day: DayRecord;
  onUpdateDay: (updatedDay: DayRecord) => void;
  onOpenCheckIn: () => void;
  onOpenRevenueModal: () => void;
  onOpenResetModal: () => void;
  onOpenIdeaCapture: () => void;
  onNavigateToTab: (tab: any) => void;
}

export const CommandCenterPage: React.FC<CommandCenterPageProps> = ({
  day,
  onUpdateDay,
  onOpenCheckIn,
  onOpenRevenueModal,
  onOpenResetModal,
  onOpenIdeaCapture,
  onNavigateToTab,
}) => {
  const [isEditingObjective, setIsEditingObjective] = useState(false);
  const [objectiveInput, setObjectiveInput] = useState(day.revenueObjective || '');
  const [newTop3Text, setNewTop3Text] = useState('');

  const top3Progress = computeTop3Progress(day.top3);
  const latestCheckIn = day.checkIns.length > 0 ? day.checkIns[day.checkIns.length - 1] : null;
  const vibrationState = latestCheckIn
    ? getStateVibrationLabel(latestCheckIn.state.vibration)
    : { label: 'Initial Baseline State (7/10)', color: 'text-amber-400' };

  // Calculate check-in timing context
  const getCheckInStatus = () => {
    if (!latestCheckIn) {
      return {
        label: 'Check-In Due',
        subtext: 'No check-ins logged today yet.',
        isOverdue: true,
      };
    }
    const lastTime = new Date(latestCheckIn.timestamp).getTime();
    const elapsedMins = Math.floor((Date.now() - lastTime) / (1000 * 60));
    if (elapsedMins >= 60) {
      return {
        label: 'Check-In Overdue',
        subtext: `Last logged ${elapsedMins} mins ago (${latestCheckIn.hour})`,
        isOverdue: true,
      };
    }
    const minsRemaining = 60 - elapsedMins;
    return {
      label: 'On Schedule',
      subtext: `Next top-of-hour prompt in ~${minsRemaining}m (Last: ${latestCheckIn.hour})`,
      isOverdue: false,
    };
  };

  const checkInStatus = getCheckInStatus();
  const nextPendingPriority = day.top3.find((t) => !t.completed);

  const handleToggleTop3 = (id: string) => {
    const updatedTop3 = day.top3.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    onUpdateDay({ ...day, top3: updatedTop3 });
  };

  const handleAddTop3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTop3Text.trim() || day.top3.length >= 3) return;
    const newItem: Top3Item = {
      id: Date.now().toString(),
      text: newTop3Text,
      completed: false,
    };
    onUpdateDay({ ...day, top3: [...day.top3, newItem] });
    setNewTop3Text('');
  };

  const handleSaveObjective = () => {
    setIsEditingObjective(false);
    onUpdateDay({ ...day, revenueObjective: objectiveInput });
  };

  const handleUpdateFocusBlock = (updatedBlock: FocusBlock) => {
    onUpdateDay({ ...day, protectedFocusBlock: updatedBlock });
  };

  const handleUpdateActiveTask = (taskTitle: string) => {
    onUpdateDay({ ...day, currentActiveTask: taskTitle });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Date & Main Highlit Action Header */}
      <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
              {formatFriendlyDate(day.dateStr)}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Command Center Overview
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Today's Operating Dashboard
          </h1>
        </div>

        {/* Action Header Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCheckIn}
            className="w-full sm:w-auto px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <Clock className="w-4 h-4 text-white" />
            <span>Hourly Check-In</span>
          </button>

          <button
            onClick={onOpenRevenueModal}
            className="px-3.5 py-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
            title="Log Revenue Action"
          >
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Log Revenue</span>
          </button>
        </div>
      </div>

      {/* Goal-Aligned Dynamic Affirmation Banner */}
      <AffirmationComponent day={day} />

      {/* SECTION 1: IMMEDIATE NEXT ACTIONS (Priority Execution Hub) */}
      <div className="bg-slate-900 rounded-xl p-5 sm:p-6 border border-slate-800 shadow-lg text-white space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-extrabold tracking-tight text-white">
              Immediate Next Actions
            </h2>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-400/10 text-amber-300 px-2.5 py-0.5 rounded border border-amber-400/20">
              High Priority Hub
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Focus & Execution Targets
          </span>
        </div>

        {/* Responsive Grid for Immediate Next Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Col 1 (lg:col-span-7): Active Focus Runner */}
          <div className="lg:col-span-7 text-slate-900">
            <ProtectedFocusRunner
              focusBlock={day.protectedFocusBlock}
              currentActiveTask={day.currentActiveTask || ''}
              onUpdateFocusBlock={handleUpdateFocusBlock}
              onUpdateActiveTask={handleUpdateActiveTask}
              onOpenIdeaCapture={onOpenIdeaCapture}
            />
          </div>

          {/* Col 2 (lg:col-span-5): Grouped Upcoming Check-In & Immediate Priority */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Card 1: Upcoming Hourly Check-In Quick Status */}
            <div className="bg-slate-800/90 rounded-xl border border-slate-700 p-4 flex flex-col justify-between space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Hourly Tracking
                    </div>
                    <div className="text-sm font-bold text-white">
                      Next Check-In Prompt
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                    checkInStatus.isOverdue
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400/30 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                  }`}
                >
                  {checkInStatus.label}
                </span>
              </div>

              <p className="text-xs text-slate-300 font-medium">
                {checkInStatus.subtext}
              </p>

              <button
                onClick={onOpenCheckIn}
                className="w-full py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span>Perform Hourly Check-In</span>
              </button>
            </div>

            {/* Card 2: Immediate Priority Objective */}
            <div className="bg-slate-800/90 rounded-xl border border-slate-700 p-4 flex flex-col justify-between space-y-3 flex-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      Primary Objective
                    </div>
                    <div className="text-sm font-bold text-white">
                      Immediate Priority Action
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-slate-400 font-semibold">
                  {top3Progress.completedCount}/{top3Progress.totalCount} Done
                </span>
              </div>

              {nextPendingPriority ? (
                <div
                  onClick={() => handleToggleTop3(nextPendingPriority.id)}
                  className="p-3 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-slate-600 cursor-pointer flex items-center gap-3 transition-colors"
                >
                  <Circle className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-200 leading-snug flex-1">
                    {nextPendingPriority.text}
                  </span>
                </div>
              ) : day.top3.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  No priority actions defined yet. Add your Top 3 actions below.
                </p>
              ) : (
                <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/80 flex items-center gap-2 text-emerald-300 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>All Top 3 priority objectives completed!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: STRATEGIC PRIORITIES & REVENUE GOAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Revenue Objective Card (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Revenue Objective
                </span>
              </div>
              {!isEditingObjective && (
                <button
                  onClick={() => setIsEditingObjective(true)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
                >
                  Edit Goal
                </button>
              )}
            </div>

            <div className="p-5">
              {isEditingObjective ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={objectiveInput}
                    onChange={(e) => setObjectiveInput(e.target.value)}
                    placeholder="Enter today's revenue objective..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsEditingObjective(false)}
                      className="px-3 py-1.5 rounded-lg text-slate-600 font-semibold text-xs hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveObjective}
                      className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-sm"
                    >
                      Save Goal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-base font-bold text-slate-900 leading-snug">
                    {day.revenueObjective || 'Set today\'s primary revenue objective.'}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="px-3 py-1 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {day.revenueEvidences.length} Verified Evidence Actions
                    </span>
                    <button
                      onClick={onOpenRevenueModal}
                      className="text-xs text-emerald-700 hover:underline font-bold flex items-center gap-1"
                    >
                      <span>+ Log Action</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-600 font-medium">
            <span>Direct Revenue Focus</span>
            <button
              onClick={() => onNavigateToTab('revenue')}
              className="text-blue-600 hover:underline font-bold flex items-center gap-1"
            >
              <span>Revenue Feed</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Top 3 Priorities List (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Target Execution
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Today's Top 3 Actions
                </h3>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                {top3Progress.completedCount}/{top3Progress.totalCount} ({top3Progress.percentage}%)
              </span>
            </div>

            <div className="p-6">
              {/* Progress bar */}
              <div className="mb-4">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${top3Progress.percentage}%` }}
                  />
                </div>
              </div>

              {/* List of Top 3 */}
              <div className="space-y-2.5">
                {day.top3.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleTop3(item.id)}
                    className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-all ${
                      item.completed
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 line-through opacity-85'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <button type="button" className="shrink-0">
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    <span className="text-xs font-medium flex-1">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Add Top 3 if less than 3 */}
              {day.top3.length < 3 && (
                <form onSubmit={handleAddTop3} className="flex gap-2 mt-4">
                  <input
                    type="text"
                    value={newTop3Text}
                    onChange={(e) => setNewTop3Text(e.target.value)}
                    placeholder="Add priority action..."
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-700 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Keep active task aligned with priorities</span>
            <button
              onClick={() => onNavigateToTab('review')}
              className="text-blue-600 hover:underline font-semibold flex items-center gap-1"
            >
              <span>Daily Review</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: OBSERVED STATE & ACTIVITY EVIDENCE LOG */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current State & Subjective Vibration Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Observed State & Vibration
              </h3>
            </div>
            <button
              onClick={onOpenResetModal}
              className="text-xs text-rose-600 hover:underline font-semibold"
            >
              Execute Reset
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-xs font-medium text-slate-600">Current Vibration Status:</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded bg-white border border-slate-200 ${vibrationState.color}`}>
                {vibrationState.label}
              </span>
            </div>

            {latestCheckIn ? (
              <div className="grid grid-cols-5 gap-2 text-center pt-2">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Mood</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{latestCheckIn.state.mood}/10</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Focus</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{latestCheckIn.state.focus}/10</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Energy</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{latestCheckIn.state.energy}/10</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Calm</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{latestCheckIn.state.calm}/10</div>
                </div>
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Conf.</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{latestCheckIn.state.confidence}/10</div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                No hourly check-in recorded yet. Complete your first check-in to observe state trends.
              </p>
            )}
          </div>
        </div>

        {/* Quick Timeline Summary Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Activity Evidence Log
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('timeline')}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                View Feed
              </button>
            </div>

            <div className="p-6 space-y-2.5">
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium">
                <span className="text-slate-700">Hourly Check-Ins Completed</span>
                <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">{day.checkIns.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium">
                <span className="text-slate-700">Revenue Evidence Actions</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">{day.revenueEvidences.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium">
                <span className="text-slate-700">Ideas Queued (No Switch)</span>
                <span className="font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded">{day.ideas.length}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <button
              onClick={onOpenCheckIn}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Complete Next Hourly Check-In</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
