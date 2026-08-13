import React, { useState, useEffect } from 'react';
import { FocusBlock } from '../types';
import { formatSecondsToHHMMSS } from '../rules/dailyRules';
import { Play, Pause, RotateCcw, Plus, Lightbulb, ShieldAlert, CheckCircle } from 'lucide-react';

interface ProtectedFocusRunnerProps {
  focusBlock: FocusBlock;
  currentActiveTask: string;
  onUpdateFocusBlock: (updated: FocusBlock) => void;
  onUpdateActiveTask: (taskTitle: string) => void;
  onOpenIdeaCapture: () => void;
}

export const ProtectedFocusRunner: React.FC<ProtectedFocusRunnerProps> = ({
  focusBlock,
  currentActiveTask,
  onUpdateFocusBlock,
  onUpdateActiveTask,
  onOpenIdeaCapture,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [taskInput, setTaskInput] = useState(currentActiveTask || '');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        onUpdateFocusBlock({
          ...focusBlock,
          elapsedSeconds: focusBlock.elapsedSeconds + 1,
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, focusBlock, onUpdateFocusBlock]);

  const targetSeconds = (focusBlock.targetMinutes || 180) * 60;
  const progressPercent = Math.min(100, Math.round((focusBlock.elapsedSeconds / targetSeconds) * 100));

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleAddMinutes = (mins: number) => {
    onUpdateFocusBlock({
      ...focusBlock,
      elapsedSeconds: focusBlock.elapsedSeconds + mins * 60,
    });
  };

  const handleResetTimer = () => {
    if (window.confirm('Reset protected focus block timer for today?')) {
      setIsRunning(false);
      onUpdateFocusBlock({
        ...focusBlock,
        elapsedSeconds: 0,
        completed: false,
      });
    }
  };

  const handleSaveTask = () => {
    setIsEditingTask(false);
    onUpdateActiveTask(taskInput);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
      {/* Card Header */}
      <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 flex items-center gap-1 border border-blue-200">
              <ShieldAlert className="w-3 h-3 text-blue-600" />
              Protected 3-Hour Focus Block
            </span>
            {progressPercent >= 100 && (
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-200">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                Target Reached
              </span>
            )}
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-1">
            {focusBlock.title || '3-Hour Deep Revenue Focus'}
          </h2>
        </div>

        <button
          onClick={onOpenIdeaCapture}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition-all self-start md:self-auto"
        >
          <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
          <span>Capture Idea (No Switch)</span>
        </button>
      </div>

      <div className="p-6 space-y-5">
        {/* Active Task Editor */}
        <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              One Active Task (Current Focus)
            </span>
            {!isEditingTask && (
              <button
                onClick={() => {
                  setTaskInput(currentActiveTask);
                  setIsEditingTask(true);
                }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline"
              >
                Change Task
              </button>
            )}
          </div>

          {isEditingTask ? (
            <div className="flex gap-2 mt-1.5">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                aria-label="Active Focus Task Title"
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Prospect research & 5 personalized outreach messages"
              />
              <button
                onClick={handleSaveTask}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Set Task
              </button>
            </div>
          ) : (
            <p className="text-sm font-semibold text-slate-800">
              {currentActiveTask || 'No active task specified. Click Change Task to set.'}
            </p>
          )}
        </div>

        {/* Timer Display & Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-slate-900 text-white p-5 rounded-xl">
          <div className="sm:col-span-7 flex items-center gap-4">
            <button
              onClick={handleToggleTimer}
              aria-label={isRunning ? 'Pause focus block timer' : 'Start focus block timer'}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all transform active:scale-95 shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                isRunning
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
            >
              {isRunning ? <Pause className="w-5 h-5 fill-current" aria-hidden="true" /> : <Play className="w-5 h-5 fill-current ml-0.5" aria-hidden="true" />}
            </button>

            <div>
              <div className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-white">
                {formatSecondsToHHMMSS(focusBlock.elapsedSeconds)}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Target: 3 Hours</span>
                <span>•</span>
                <span className="text-blue-400 font-semibold">{progressPercent}% Completed</span>
              </div>
            </div>
          </div>

          <div className="sm:col-span-5 flex items-center justify-end gap-2 border-t sm:border-t-0 border-slate-800 pt-3 sm:pt-0">
            <button
              onClick={() => handleAddMinutes(15)}
              aria-label="Add 15 minutes to timer"
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <Plus className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
              <span>+15m</span>
            </button>

            <button
              onClick={handleResetTimer}
              aria-label="Reset focus block timer"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs border border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
