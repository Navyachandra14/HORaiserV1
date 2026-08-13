/**
 * HORaiser — State & Vibration Rules Engine
 * Subjective state model: Current State -> Desired State -> Selected Intervention -> Observed Change
 * State Reset Protocol: STOP -> NAME -> LOCATE -> SEPARATE -> RESET -> RETURN
 */

import { StateMetrics } from '../types';

export const RESET_PROTOCOL_STEPS = [
  {
    step: 1,
    code: 'STOP',
    title: 'Pause Active Activity',
    instruction: 'Immediately release mouse/keyboard. Stop racing thoughts. Take a deliberate physical pause.',
  },
  {
    step: 2,
    code: 'NAME',
    title: 'Name What You Are Feeling',
    instruction: 'Acknowledge emotional state without judgement (e.g. "Overwhelmed", "Fearful of rejection", "Scattered", "Frustrated").',
  },
  {
    step: 3,
    code: 'LOCATE',
    title: 'Locate the Physical Trigger',
    instruction: 'Where is this feeling manifesting? Chest tension, shallow breathing, jaw clenching, browser tab hopping?',
  },
  {
    step: 4,
    code: 'SEPARATE',
    title: 'Separate Fact from Interpretation',
    instruction: 'Fact: "I sent 5 outreach emails and have 0 replies." Interpretation: "I will fail." Separate fact from story.',
  },
  {
    step: 5,
    code: 'RESET',
    title: 'Execute Grounding Practice',
    instruction: 'Perform 60 seconds of box breathing, drink water, stretch shoulders, or recite personal grounding affirmation.',
  },
  {
    step: 6,
    code: 'RETURN',
    title: 'Return to One Active Task',
    instruction: 'Identify the absolute smallest micro-step for your current task and execute it now.',
  },
];

export function computeAverageState(states: StateMetrics[]): {
  avgMood: number;
  avgFocus: number;
  avgEnergy: number;
  avgCalm: number;
  avgConfidence: number;
  avgVibration: number;
} {
  if (!states || states.length === 0) {
    return { avgMood: 7, avgFocus: 7, avgEnergy: 7, avgCalm: 7, avgConfidence: 7, avgVibration: 7 };
  }

  const sum = states.reduce(
    (acc, curr) => ({
      mood: acc.mood + curr.mood,
      focus: acc.focus + curr.focus,
      energy: acc.energy + curr.energy,
      calm: acc.calm + curr.calm,
      confidence: acc.confidence + curr.confidence,
      vibration: acc.vibration + curr.vibration,
    }),
    { mood: 0, focus: 0, energy: 0, calm: 0, confidence: 0, vibration: 0 }
  );

  const len = states.length;
  return {
    avgMood: Number((sum.mood / len).toFixed(1)),
    avgFocus: Number((sum.focus / len).toFixed(1)),
    avgEnergy: Number((sum.energy / len).toFixed(1)),
    avgCalm: Number((sum.calm / len).toFixed(1)),
    avgConfidence: Number((sum.confidence / len).toFixed(1)),
    avgVibration: Number((sum.vibration / len).toFixed(1)),
  };
}

export function getStateVibrationLabel(score: number): { label: string; color: string } {
  if (score >= 9) return { label: 'Peak Flow & Alignment (9-10)', color: 'text-amber-400' };
  if (score >= 7) return { label: 'Calm, Focused & Purposeful (7-8)', color: 'text-emerald-400' };
  if (score >= 5) return { label: 'Moderate / Grounded Baseline (5-6)', color: 'text-blue-400' };
  if (score >= 3) return { label: 'Scattered / Low Energy (3-4)', color: 'text-amber-500' };
  return { label: 'Overwhelmed / High Noise (1-2) — Needs Reset', color: 'text-rose-500' };
}
