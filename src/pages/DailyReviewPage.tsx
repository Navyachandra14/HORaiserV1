import React, { useState } from 'react';
import { DayRecord, DailyReview } from '../types';
import { DailyScorecard } from '../components/DailyScorecard';
import { CheckCircle2, Sparkles, Send, ShieldCheck, HelpCircle } from 'lucide-react';

interface DailyReviewPageProps {
  day: DayRecord;
  onUpdateDay: (updatedDay: DayRecord) => void;
}

export const DailyReviewPage: React.FC<DailyReviewPageProps> = ({ day, onUpdateDay }) => {
  const existingReview = day.review;

  const [revenueEvidenceSummary, setRevenueEvidenceSummary] = useState(
    existingReview?.revenueEvidenceSummary ||
      (day.revenueEvidences.length > 0
        ? `${day.revenueEvidences.length} revenue evidence action(s) logged.`
        : 'Dedicated focus block completed.')
  );
  const [coreProgressSummary, setCoreProgressSummary] = useState(existingReview?.coreProgressSummary || '');
  const [explorationSummary, setExplorationSummary] = useState(existingReview?.explorationSummary || '');
  const [dominantState, setDominantState] = useState(existingReview?.dominantState || 'Calm & Focused');
  const [startVibration, setStartVibration] = useState(existingReview?.startVibration || 7);
  const [endVibration, setEndVibration] = useState(existingReview?.endVibration || 8);
  const [recoveryNotes, setRecoveryNotes] = useState(existingReview?.recoveryNotes || '');
  const [learningRecorded, setLearningRecorded] = useState(existingReview?.learningRecorded || '');
  const [deviationNotes, setDeviationNotes] = useState(existingReview?.deviationNotes || '');
  const [evidenceOfCourage, setEvidenceOfCourage] = useState(existingReview?.evidenceOfCourage || '');

  const [tomorrow1, setTomorrow1] = useState(existingReview?.tomorrowTop3?.[0] || '');
  const [tomorrow2, setTomorrow2] = useState(existingReview?.tomorrowTop3?.[1] || '');
  const [tomorrow3, setTomorrow3] = useState(existingReview?.tomorrowTop3?.[2] || '');
  const [tomorrowObjective, setTomorrowObjective] = useState(
    existingReview?.tomorrowRevenueObjective || day.revenueObjective || ''
  );

  const [isSaved, setIsSaved] = useState(Boolean(existingReview));

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();

    const newReview: DailyReview = {
      id: `review_${day.dateStr}`,
      dateStr: day.dateStr,
      completedAt: new Date().toISOString(),
      revenueEvidenceSummary,
      coreProgressSummary,
      explorationSummary,
      dominantState,
      startVibration,
      endVibration,
      recoveryNotes,
      learningRecorded,
      deviationNotes,
      evidenceOfCourage,
      tomorrowTop3: [tomorrow1, tomorrow2, tomorrow3].filter(Boolean),
      tomorrowRevenueObjective: tomorrowObjective,
    };

    onUpdateDay({
      ...day,
      review: newReview,
    });

    setIsSaved(true);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            Evening Reflection
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Daily Review & Scorecard
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Extract evidence, analyze deviations, observe state movement, and prepare tomorrow.
          </p>
        </div>

        {isSaved && (
          <span className="px-3.5 py-1.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 self-start">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Review Saved
          </span>
        )}
      </div>

      {/* Daily Scorecard Component */}
      <DailyScorecard day={day} />

      {/* Daily Review Form */}
      <form onSubmit={handleSaveReview} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">
            Reflection Questions & Tomorrow Alignment
          </h3>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                1. What revenue activity was performed?
              </label>
              <textarea
                value={revenueEvidenceSummary}
                onChange={(e) => setRevenueEvidenceSummary(e.target.value)}
                rows={2}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                2. What core progress happened today?
              </label>
              <textarea
                value={coreProgressSummary}
                onChange={(e) => setCoreProgressSummary(e.target.value)}
                rows={2}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none font-medium"
                placeholder="Key task completed or milestone reached"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                3. What did I learn / build?
              </label>
              <input
                type="text"
                value={learningRecorded}
                onChange={(e) => setLearningRecorded(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none font-medium"
                placeholder="Capability or insight acquired"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                4. Evidence of courage (acted despite hesitation)
              </label>
              <input
                type="text"
                value={evidenceOfCourage}
                onChange={(e) => setEvidenceOfCourage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none font-medium"
                placeholder="e.g., Published video / Sent outreach pitch"
              />
            </div>
          </div>

          {/* State Movement (Start vs End) */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Subjective Vibration / State Movement
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-1">Dominant Mood / State</label>
                <input
                  type="text"
                  value={dominantState}
                  onChange={(e) => setDominantState(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-1">Morning Vibration: {startVibration}/10</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={startVibration}
                  onChange={(e) => setStartVibration(Number(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 font-medium mb-1">Evening Vibration: {endVibration}/10</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={endVibration}
                  onChange={(e) => setEndVibration(Number(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Preparation for Tomorrow */}
          <div className="bg-blue-50/60 p-5 rounded-lg border border-blue-200 space-y-3">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
              Prepare Tomorrow's Alignment
            </span>

            <div>
              <label className="block text-xs text-slate-800 font-bold mb-1">
                Tomorrow's Revenue Objective
              </label>
              <input
                type="text"
                value={tomorrowObjective}
                onChange={(e) => setTomorrowObjective(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
                placeholder="Specific revenue-generating target for tomorrow"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-800 font-bold mb-1">
                Tomorrow's Top 3 Priority Actions
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  value={tomorrow1}
                  onChange={(e) => setTomorrow1(e.target.value)}
                  placeholder="Top 1 Action (Revenue / Core Priority)"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-medium"
                />
                <input
                  type="text"
                  value={tomorrow2}
                  onChange={(e) => setTomorrow2(e.target.value)}
                  placeholder="Top 2 Action (Focus Block Task)"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-medium"
                />
                <input
                  type="text"
                  value={tomorrow3}
                  onChange={(e) => setTomorrow3(e.target.value)}
                  placeholder="Top 3 Action (Foundation / Communication)"
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-medium"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Save Reflection & Lock Day</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
