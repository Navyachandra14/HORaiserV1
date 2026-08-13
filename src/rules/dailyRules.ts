/**
 * HORaiser — Daily Rules Engine
 * Pure, deterministic rules for day initialization, top 3 management, and focus targets.
 */

import { DayRecord, FocusBlock, Top3Item, UserSettings } from '../types';

export function getTodayDateStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatFriendlyDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function createInitialDay(dateStr: string, settings: UserSettings): DayRecord {
  const defaultFocusBlock: FocusBlock = {
    id: `fb_${dateStr}`,
    dateStr,
    title: '3-Hour Protected Revenue & Core Focus Block',
    targetMinutes: 180, // 3 hours
    elapsedSeconds: 0,
    completed: false,
  };

  const defaultTop3: Top3Item[] = [
    { id: '1', text: 'Execute daily revenue-generation activity (Outreach / Pipeline / Delivery)', completed: false, category: 'Revenue' },
    { id: '2', text: 'Protect 3 hours of uninterrupted deep focus work', completed: false, category: 'Core Work' },
    { id: '3', text: 'Complete hourly check-ins & evening reflection review', completed: false, category: 'Foundation' },
  ];

  return {
    dateStr,
    primaryDirection: settings.primaryDirection,
    revenueObjective: 'Complete 5 personalized lead outreaches or progress client proposal',
    top3: defaultTop3,
    protectedFocusBlock: defaultFocusBlock,
    currentActiveTask: 'Focus Block Task 1: Pipeline & Revenue Generation',
    currentActiveTaskId: 'task_1',
    checkIns: [],
    revenueEvidences: [],
    ideas: [],
    lastUpdated: new Date().toISOString(),
  };
}

export function computeTop3Progress(top3: Top3Item[]): { completedCount: number; totalCount: number; percentage: number } {
  if (!top3 || top3.length === 0) return { completedCount: 0, totalCount: 0, percentage: 0 };
  const completedCount = top3.filter((t) => t.completed).length;
  return {
    completedCount,
    totalCount: top3.length,
    percentage: Math.round((completedCount / top3.length) * 100),
  };
}

export function formatSecondsToHHMMSS(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  }
  return `${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
}
