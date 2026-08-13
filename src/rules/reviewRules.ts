/**
 * HORaiser — Review Rules Engine
 * Generates multi-dimensional evidence scorecard without a toxic single "productivity" score.
 */

import { DayRecord } from '../types';

export interface DimensionScore {
  dimension: string;
  question: string;
  status: 'Achieved' | 'Partial' | 'Pending';
  evidence: string;
}

export function generateDailyScorecard(day: DayRecord): DimensionScore[] {
  const checkIns = day.checkIns || [];
  const revenueEvidences = day.revenueEvidences || [];
  const top3 = day.top3 || [];
  const focusSecs = day.protectedFocusBlock?.elapsedSeconds || 0;

  const revenueCheckIns = checkIns.filter((c) => c.revenueType !== 'Not Revenue' || c.category === 'Revenue');
  const alignedCheckIns = checkIns.filter((c) => c.aligned === 'Yes');
  const buildCheckIns = checkIns.filter((c) => c.category === 'Build');
  const commCheckIns = checkIns.filter((c) => c.category === 'Communication');
  const foundationCheckIns = checkIns.filter((c) => c.category === 'Foundation' || c.category === 'Recovery');

  return [
    {
      dimension: 'Revenue',
      question: 'Did I create or advance revenue?',
      status: revenueEvidences.length > 0 || revenueCheckIns.length > 0 ? 'Achieved' : 'Pending',
      evidence: revenueEvidences.length > 0 ? `${revenueEvidences.length} revenue evidence item(s) logged.` : 'No revenue evidence recorded.',
    },
    {
      dimension: 'Focus',
      question: 'Did I protect attention for deep work?',
      status: focusSecs >= 7200 ? 'Achieved' : focusSecs >= 3600 ? 'Partial' : 'Pending',
      evidence: `Protected focus timer reached ${Math.floor(focusSecs / 60)} minutes.`,
    },
    {
      dimension: 'Execution',
      question: 'Did I convert intention into completed actions?',
      status: top3.filter((t) => t.completed).length >= 2 ? 'Achieved' : 'Partial',
      evidence: `${top3.filter((t) => t.completed).length} of ${top3.length} Top 3 priorities completed.`,
    },
    {
      dimension: 'Learning',
      question: 'Did I gain useful, applicable capability?',
      status: checkIns.some((c) => c.category === 'Learning' || c.category === 'Exploration') ? 'Achieved' : 'Partial',
      evidence: `${checkIns.filter((c) => c.category === 'Learning').length} check-in(s) marked as learning/exploration.`,
    },
    {
      dimension: 'Building',
      question: 'Did I build or refine a reusable asset?',
      status: buildCheckIns.length > 0 ? 'Achieved' : 'Pending',
      evidence: `${buildCheckIns.length} check-in(s) devoted to building assets/systems.`,
    },
    {
      dimension: 'Communication',
      question: 'Did I create or maintain professional visibility?',
      status: commCheckIns.length > 0 ? 'Achieved' : 'Pending',
      evidence: `${commCheckIns.length} check-in(s) for publishing, outreach, or networking.`,
    },
    {
      dimension: 'Courage',
      question: 'Did I act despite hesitation or fear?',
      status: day.review?.evidenceOfCourage ? 'Achieved' : 'Partial',
      evidence: day.review?.evidenceOfCourage || 'Recorded courage actions in review.',
    },
    {
      dimension: 'Recovery',
      question: 'Did I return to purpose after any deviation?',
      status: alignedCheckIns.length >= Math.ceil(checkIns.length * 0.5) ? 'Achieved' : 'Partial',
      evidence: `${alignedCheckIns.length} of ${checkIns.length} hourly check-ins were aligned.`,
    },
    {
      dimension: 'State',
      question: 'Did my internal state stabilize or improve?',
      status: checkIns.length > 0 ? 'Achieved' : 'Pending',
      evidence: `${checkIns.length} state snapshots recorded throughout the day.`,
    },
    {
      dimension: 'Foundation',
      question: 'Did I maintain basic physical & quiet practices?',
      status: foundationCheckIns.length > 0 ? 'Achieved' : 'Partial',
      evidence: `${foundationCheckIns.length} check-in(s) logged under foundation or recovery.`,
    },
  ];
}
