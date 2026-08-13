import React from 'react';
import { DayRecord } from '../types';
import { generateDailyScorecard, DimensionScore } from '../rules/reviewRules';
import { computeAverageState } from '../rules/stateRules';
import {
  Award,
  TrendingUp,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Target,
  Sparkles,
  Zap,
  BarChart2,
  ChevronRight,
  Flame
} from 'lucide-react';

interface DailyScorecardProps {
  day: DayRecord;
}

export interface ScoreBreakdown {
  totalScore: number; // 0 - 100
  tierLabel: string;
  tierColor: string;
  tierBg: string;
  checkInScore: number; // max 30
  revenueScore: number; // max 35
  executionScore: number; // max 20
  vibrationScore: number; // max 15
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
  dimensions: DimensionScore[];
}

export function calculateDailyScore(day: DayRecord): ScoreBreakdown {
  const checkIns = day.checkIns || [];
  const revenueEvidences = day.revenueEvidences || [];
  const top3 = day.top3 || [];
  const focusSecs = day.protectedFocusBlock?.elapsedSeconds || 0;

  const totalCheckIns = checkIns.length;
  const alignedCheckIns = checkIns.filter((c) => c.aligned === 'Yes').length;
  const alignmentRatio = totalCheckIns > 0 ? alignedCheckIns / totalCheckIns : 0;

  // 1. Check-In & Focus Alignment Score (Max 30 pts)
  // Target: 8 check-ins per day = 15 pts max. Alignment ratio = 15 pts max.
  const volumePts = Math.min(15, Math.round((totalCheckIns / 8) * 15));
  const alignmentPts = Math.round(alignmentRatio * 15);
  const checkInScore = Math.min(30, volumePts + alignmentPts);

  // 2. Revenue Goal & Proof Score (Max 35 pts)
  // Revenue objective set = 5 pts.
  // Verified revenue actions = 20 pts for 1+, bonus 10 pts for 2+.
  let revenueScore = 0;
  if (day.revenueObjective && day.revenueObjective.trim().length > 0) {
    revenueScore += 5;
  }
  if (revenueEvidences.length >= 2) {
    revenueScore += 30;
  } else if (revenueEvidences.length === 1) {
    revenueScore += 20;
  } else {
    // Check if any check-in was categorized as Revenue
    const revenueCheckIns = checkIns.filter((c) => c.category === 'Revenue' || c.revenueType !== 'Not Revenue');
    if (revenueCheckIns.length > 0) {
      revenueScore += 10;
    }
  }
  revenueScore = Math.min(35, revenueScore);

  // 3. Top 3 Execution & Focus Block (Max 20 pts)
  const completedTop3 = top3.filter((t) => t.completed).length;
  const top3Ratio = top3.length > 0 ? completedTop3 / top3.length : 0;
  const top3Pts = Math.round(top3Ratio * 10);
  const focusBlockPts = focusSecs >= 5400 ? 10 : focusSecs >= 2700 ? 6 : focusSecs > 0 ? 3 : 0;
  const executionScore = Math.min(20, top3Pts + focusBlockPts);

  // 4. State Vibration Score (Max 15 pts)
  const stateStats = computeAverageState(checkIns.map((c) => c.state));
  const vibrationPts = Math.min(15, Math.round((stateStats.avgVibration / 10) * 15));
  const vibrationScore = Math.min(15, vibrationPts);

  const totalScore = Math.min(100, checkInScore + revenueScore + executionScore + vibrationScore);

  // Determine Tier
  let tierLabel = 'C-Tier / Moderate Friction';
  let tierColor = 'text-amber-600';
  let tierBg = 'bg-amber-50 border-amber-200';

  if (totalScore >= 85) {
    tierLabel = 'S-Tier / Operational Mastery';
    tierColor = 'text-emerald-700';
    tierBg = 'bg-emerald-50 border-emerald-200';
  } else if (totalScore >= 70) {
    tierLabel = 'A-Tier / High Focus Driver';
    tierColor = 'text-blue-700';
    tierBg = 'bg-blue-50 border-blue-200';
  } else if (totalScore >= 55) {
    tierLabel = 'B-Tier / Solid Progress';
    tierColor = 'text-indigo-700';
    tierBg = 'bg-indigo-50 border-indigo-200';
  } else if (totalScore < 40) {
    tierLabel = 'D-Tier / Focus Reset Required';
    tierColor = 'text-rose-700';
    tierBg = 'bg-rose-50 border-rose-200';
  }

  // Generate Strengths
  const strengths: string[] = [];
  if (revenueEvidences.length > 0) {
    strengths.push(`Revenue Proof Generated: Logged ${revenueEvidences.length} verified revenue action(s).`);
  }
  if (totalCheckIns > 0 && Math.round(alignmentRatio * 100) >= 70) {
    strengths.push(`High Focus Alignment: ${Math.round(alignmentRatio * 100)}% of check-ins were aligned with top priorities.`);
  }
  if (top3.length > 0 && completedTop3 === top3.length) {
    strengths.push(`Flawless Execution: Completed all ${top3.length} Top 3 priority objectives.`);
  } else if (completedTop3 > 0) {
    strengths.push(`Priority Momentum: Completed ${completedTop3} of ${top3.length} core daily tasks.`);
  }
  if (focusSecs >= 3600) {
    strengths.push(`Protected Focus Block: Maintained ${Math.floor(focusSecs / 60)} minutes of deep work.`);
  }
  if (stateStats.avgVibration >= 7.5) {
    strengths.push(`High Vibration Baseline: Average state vibration score reached ${stateStats.avgVibration}/10.`);
  }
  if (strengths.length === 0) {
    strengths.push('Active Awareness: Captured daily baseline records for future calibration.');
  }

  // Generate Weaknesses / Friction Points
  const weaknesses: string[] = [];
  if (revenueEvidences.length === 0) {
    weaknesses.push('Revenue Execution Gap: Zero verifiable revenue proof actions recorded today.');
  }
  if (totalCheckIns < 5) {
    weaknesses.push(`Low Check-In Density: Only ${totalCheckIns} check-in(s) logged today (target is 8+).`);
  }
  if (totalCheckIns > 0 && Math.round(alignmentRatio * 100) < 70) {
    weaknesses.push(`Distraction Slippage: ${totalCheckIns - alignedCheckIns} check-in(s) marked unaligned with core goals.`);
  }
  if (top3.length > 0 && completedTop3 < top3.length) {
    weaknesses.push(`Incomplete Priorities: ${top3.length - completedTop3} Top 3 action items remain unfulfilled.`);
  }
  if (focusSecs < 1800) {
    weaknesses.push('Limited Deep Work: Less than 30 minutes of uninterrupted focus logged today.');
  }
  if (weaknesses.length === 0) {
    weaknesses.push('Zero major operational bottlenecks identified for today.');
  }

  // Actionable Recommendation for Tomorrow
  let recommendation = 'Maintain momentum by setting clear Top 3 objectives tomorrow morning.';
  if (revenueEvidences.length === 0) {
    recommendation = 'Tomorrow Priority Shift: Schedule a dedicated 90-minute revenue generation block first thing in the morning.';
  } else if (Math.round(alignmentRatio * 100) < 70 && totalCheckIns > 0) {
    recommendation = 'Tomorrow Priority Shift: Reduce context switching. Complete one priority item fully before switching tasks.';
  } else if (focusSecs < 1800) {
    recommendation = 'Tomorrow Priority Shift: Activate the Protected Focus Runner to guard 60 minutes of uninterrupted work.';
  } else if (completedTop3 < top3.length) {
    recommendation = 'Tomorrow Priority Shift: Narrow down focus to 1 non-negotiable core objective before taking on secondary tasks.';
  }

  const dimensions = generateDailyScorecard(day);

  return {
    totalScore,
    tierLabel,
    tierColor,
    tierBg,
    checkInScore,
    revenueScore,
    executionScore,
    vibrationScore,
    strengths,
    weaknesses,
    recommendation,
    dimensions,
  };
}

export const DailyScorecard: React.FC<DailyScorecardProps> = ({ day }) => {
  const scorecard = calculateDailyScore(day);
  const totalCheckIns = day.checkIns?.length || 0;
  const alignedCheckIns = (day.checkIns || []).filter((c) => c.aligned === 'Yes').length;
  const alignmentPercent = totalCheckIns > 0 ? Math.round((alignedCheckIns / totalCheckIns) * 100) : 0;
  const completedTop3 = (day.top3 || []).filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      {/* Score Overview Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded border border-blue-400/30">
                Daily Performance Scorecard
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Date: {day.dateStr}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Daily Operational Score: {scorecard.totalScore} / 100
            </h2>
            <p className="text-xs text-slate-300 font-medium mt-1 max-w-xl">
              Computed deterministically from check-in volume, focus alignment, revenue proof actions, and priority execution.
            </p>
          </div>

          {/* Tier Badge & Circular Indicator */}
          <div className="flex items-center gap-4 bg-slate-800/80 p-4 rounded-xl border border-slate-700 shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-slate-700"
                  fill="transparent"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray={163.36}
                  strokeDashoffset={163.36 - (163.36 * scorecard.totalScore) / 100}
                  className="text-blue-500 transition-all duration-1000 ease-out"
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-lg font-extrabold text-white">
                {scorecard.totalScore}
              </span>
            </div>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Performance Tier
              </div>
              <div className={`text-sm font-bold ${scorecard.tierColor.replace('text-', 'text-')} text-white mt-0.5`}>
                {scorecard.tierLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Score Factor Breakdown Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100 bg-slate-50/50 border-t border-slate-200 text-center p-4">
          <div className="p-3">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Check-Ins & Focus</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">
              {scorecard.checkInScore} <span className="text-xs font-normal text-slate-400">/ 30 pts</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {totalCheckIns} logged ({alignmentPercent}% aligned)
            </div>
          </div>

          <div className="p-3">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Revenue Goal & Proof</div>
            <div className="text-xl font-extrabold text-emerald-600 mt-1">
              {scorecard.revenueScore} <span className="text-xs font-normal text-slate-400">/ 35 pts</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {day.revenueEvidences.length} verified action(s)
            </div>
          </div>

          <div className="p-3">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Top Priorities & Focus</div>
            <div className="text-xl font-extrabold text-blue-600 mt-1">
              {scorecard.executionScore} <span className="text-xs font-normal text-slate-400">/ 20 pts</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {completedTop3} of {day.top3.length} Top 3 done
            </div>
          </div>

          <div className="p-3">
            <div className="text-[10px] font-bold text-slate-500 uppercase">Vibration Baseline</div>
            <div className="text-xl font-extrabold text-indigo-600 mt-1">
              {scorecard.vibrationScore} <span className="text-xs font-normal text-slate-400">/ 15 pts</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Average vibration quality
            </div>
          </div>
        </div>
      </div>

      {/* Primary Actionable Tomorrow Recommendation */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-5 shadow-sm flex items-start gap-3.5">
        <Target className="w-6 h-6 text-amber-300 shrink-0 mt-0.5" />
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
            Key Priority Directive For Improvement
          </div>
          <p className="text-sm font-semibold mt-1 leading-relaxed">
            {scorecard.recommendation}
          </p>
        </div>
      </div>

      {/* Strengths & Weaknesses Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Today's Highlights & Strengths</span>
          </div>
          <ul className="space-y-2.5">
            {scorecard.strengths.map((item, idx) => (
              <li key={idx} className="text-xs text-emerald-950 font-medium flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses / Operational Friction */}
        <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Identified Friction & Areas for Improvement</span>
          </div>
          <ul className="space-y-2.5">
            {scorecard.weaknesses.map((item, idx) => (
              <li key={idx} className="text-xs text-rose-950 font-medium flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0 mt-1.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 10-Dimensional Progress Scorecard Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
              Multi-Dimensional Evidence Assessment
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              10-Dimensional Progress Matrix
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Zero Manufactured Scores
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {scorecard.dimensions.map((item) => (
            <div
              key={item.dimension}
              className={`p-3 rounded-lg border flex flex-col justify-between ${
                item.status === 'Achieved'
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                  : item.status === 'Partial'
                  ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold font-mono uppercase text-slate-800">
                    {item.dimension}
                  </span>
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      item.status === 'Achieved'
                        ? 'bg-emerald-200 text-emerald-900'
                        : item.status === 'Partial'
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-slate-900">{item.question}</div>
              </div>
              <div className="text-[10px] text-slate-500 mt-2 italic">{item.evidence}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
