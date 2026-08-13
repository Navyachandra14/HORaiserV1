import React, { useState, useEffect } from 'react';
import { db } from '../storage/db';
import { DayRecord } from '../types';
import { computeAverageState } from '../rules/stateRules';
import { BarChart3, TrendingUp, Clock, ShieldCheck, Calendar, Sparkles, Target, Award, AlertTriangle, Zap } from 'lucide-react';

type TimeHorizon = 'daily' | 'weekly' | 'monthly' | 'all';

export const AnalyticsPage: React.FC = () => {
  const [allDays, setAllDays] = useState<DayRecord[]>([]);
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('weekly');

  useEffect(() => {
    db.getAllDays().then(setAllDays);
  }, []);

  // Filter days based on timeHorizon
  const getFilteredDays = (): DayRecord[] => {
    if (allDays.length === 0) return [];
    if (timeHorizon === 'daily') {
      return allDays.slice(-1);
    }
    if (timeHorizon === 'weekly') {
      return allDays.slice(-7);
    }
    if (timeHorizon === 'monthly') {
      return allDays.slice(-30);
    }
    return allDays;
  };

  const filteredDays = getFilteredDays();
  const totalDaysLogged = filteredDays.length;
  const daysWithRevenue = filteredDays.filter((d) => d.revenueEvidences.length > 0).length;
  const totalRevenueActions = filteredDays.reduce((acc, curr) => acc + curr.revenueEvidences.length, 0);

  const allCheckIns = filteredDays.flatMap((d) => d.checkIns);
  const totalCheckIns = allCheckIns.length;
  const alignedCheckIns = allCheckIns.filter((c) => c.aligned === 'Yes').length;
  const unalignedCheckIns = allCheckIns.filter((c) => c.aligned === 'No').length;

  const alignmentRatio = totalCheckIns > 0 ? Math.round((alignedCheckIns / totalCheckIns) * 100) : 0;
  const avgState = computeAverageState(allCheckIns.map((c) => c.state));

  // Category counts
  const categoryCounts: Record<string, number> = {};
  allCheckIns.forEach((c) => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  // Calculate Strengths, Weaknesses, and Priority Shift Advice
  const getStrengths = (): string[] => {
    const list: string[] = [];
    if (alignmentRatio >= 70) {
      list.push(`High Focus Alignment: ${alignmentRatio}% of hourly check-ins were strictly aligned with top goals.`);
    }
    if (avgState.avgVibration >= 7.5) {
      list.push(`Elevated Vibration Baseline: Average state vibration score is ${avgState.avgVibration}/10.`);
    }
    if (daysWithRevenue > 0) {
      list.push(`Active Revenue Engine: Recorded ${totalRevenueActions} revenue evidence proof actions.`);
    }
    if (avgState.avgFocus >= 7.5) {
      list.push(`Strong Cognitive Focus: Deep work focus average maintained at ${avgState.avgFocus}/10.`);
    }
    if (list.length === 0) {
      list.push("Awareness Logging Active: Gathering baseline local evidence across target areas.");
    }
    return list;
  };

  const getWeaknesses = (): string[] => {
    const list: string[] = [];
    if (unalignedCheckIns > 0) {
      list.push(`Distraction Slippage: ${unalignedCheckIns} check-in(s) were marked unaligned with core daily targets.`);
    }
    if (avgState.avgEnergy < 7.0 && totalCheckIns > 0) {
      list.push(`Energy Dip Detected: Average energy score (${avgState.avgEnergy}/10) indicates afternoon fatigue.`);
    }
    if (daysWithRevenue < totalDaysLogged && totalDaysLogged > 0) {
      list.push(`Revenue Gaps: ${totalDaysLogged - daysWithRevenue} day(s) in this window had zero recorded revenue actions.`);
    }
    if (avgState.avgCalm < 7.0 && totalCheckIns > 0) {
      list.push(`Stress Sensitivity: Calm baseline is ${avgState.avgCalm}/10. Consider 15-second breathing state resets.`);
    }
    if (list.length === 0) {
      list.push("No major operational bottlenecks detected in this window.");
    }
    return list;
  };

  const getPriorityShiftAdvice = (): string => {
    if (alignmentRatio < 70 && totalCheckIns > 0) {
      return "Priority Shift: Reduce context switching. Commit to 3-hour uninterrupted focus blocks before opening email or admin tasks.";
    }
    if (daysWithRevenue === 0 && totalDaysLogged > 0) {
      return "Revenue Priority Shift: Allocate your first 90 minutes tomorrow strictly to Direct Revenue & Prospecting activities.";
    }
    if (avgState.avgEnergy < 7.0 && totalCheckIns > 0) {
      return "Vibration Priority Shift: Incorporate hydration and physical movement resets every 2 hours to maintain energy above 8/10.";
    }
    return "Optimized Trajectory: Maintain current high-vibration focus momentum. Scale prospecting outreach by 15% next week.";
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header & Time Horizon Selector */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
              Productivity & Vibration Coach
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Progress Scorecard & Analytics
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Local evaluation of focus alignment, vibration state, strengths, weaknesses, and priority shifts.
          </p>
        </div>

        {/* Time Horizon Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
          {(['daily', 'weekly', 'monthly', 'all'] as TimeHorizon[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setTimeHorizon(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${
                timeHorizon === tab
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {tab === 'all' ? 'All Time' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase text-slate-500">Horizon Window</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{totalDaysLogged} Days</div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">Logged in {timeHorizon} view</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase text-slate-500">Revenue Consistency</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">
            {totalDaysLogged > 0 ? Math.round((daysWithRevenue / totalDaysLogged) * 100) : 0}%
          </div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">
            {daysWithRevenue} of {totalDaysLogged} days with proof
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase text-slate-500">Check-Ins Executed</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-blue-600">{totalCheckIns}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">Hourly logs captured</div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase text-slate-500">Priority Alignment</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-blue-600">{alignmentRatio}%</div>
          <div className="text-[10px] text-slate-400 font-medium mt-1">Aligned with goals</div>
        </div>
      </div>

      {/* Expert Productivity Coach Diagnostics Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">
              Productivity Coach Diagnostics ({timeHorizon.toUpperCase()})
            </h3>
          </div>
          <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 px-2.5 py-1 rounded border border-blue-200">
            Deterministic Verdict
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Actionable Priority Shift Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl p-4 shadow-sm flex items-start gap-3">
            <Target className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Recommended Priority Shift For Achievement
              </div>
              <p className="text-sm font-semibold mt-1 leading-relaxed">
                {getPriorityShiftAdvice()}
              </p>
            </div>
          </div>

          {/* Strengths & Weaknesses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>Identified Strengths & Advantages</span>
              </div>
              <ul className="space-y-2">
                {getStrengths().map((item, idx) => (
                  <li key={idx} className="text-xs text-emerald-950 font-medium flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses / Friction */}
            <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Operational Weaknesses & Friction</span>
              </div>
              <ul className="space-y-2">
                {getWeaknesses().map((item, idx) => (
                  <li key={idx} className="text-xs text-rose-950 font-medium flex items-start gap-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Internal State & Vibration Scorecard */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              State & Vibration Scorecard
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Computed from {totalCheckIns} hourly logs
          </span>
        </div>

        <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-center">
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Avg Mood</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">{avgState.avgMood}/10</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Avg Focus</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">{avgState.avgFocus}/10</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Avg Energy</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">{avgState.avgEnergy}/10</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Avg Calm</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">{avgState.avgCalm}/10</div>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Avg Confidence</div>
            <div className="text-xl font-extrabold text-slate-900 mt-1">{avgState.avgConfidence}/10</div>
          </div>

          <div className="bg-blue-50 p-3.5 rounded-lg border border-blue-200">
            <div className="text-[10px] text-blue-700 uppercase font-bold">Avg Vibration</div>
            <div className="text-xl font-extrabold text-blue-700 mt-1">{avgState.avgVibration}/10</div>
          </div>
        </div>
      </div>

      {/* Activity Classification Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">
            Time Allocation Breakdown
          </h3>
        </div>

        <div className="p-6">
          {Object.keys(categoryCounts).length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-6 font-medium">
              No check-ins logged for this time window yet. Execute check-ins on the Today tab.
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(categoryCounts).map(([catName, count]) => {
                const percentage = Math.round((count / totalCheckIns) * 100);
                return (
                  <div key={catName} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-800">
                      <span>{catName}</span>
                      <span className="text-slate-500">{count} logs ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
