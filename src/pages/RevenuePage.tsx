import React from 'react';
import { DayRecord } from '../types';
import { evaluateDailyRevenueStatus, REVENUE_LANE_DESCRIPTIONS } from '../rules/revenueRules';
import { TrendingUp, Plus, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

interface RevenuePageProps {
  day: DayRecord;
  onOpenRevenueModal: () => void;
}

export const RevenuePage: React.FC<RevenuePageProps> = ({ day, onOpenRevenueModal }) => {
  const status = evaluateDailyRevenueStatus(day.revenueEvidences);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            Income Engine
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Revenue Dashboard & Evidence
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Every working day requires at least one recorded revenue-generation action.
          </p>
        </div>

        <button
          onClick={onOpenRevenueModal}
          className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Log Revenue Evidence</span>
        </button>
      </div>

      {/* Revenue Status Banner */}
      <div
        className={`p-5 rounded-xl border flex items-center gap-4 shadow-sm ${
          status.hasRevenueAction
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}
      >
        <div className="p-3 rounded-lg bg-white shrink-0 border border-slate-200 shadow-xs">
          {status.hasRevenueAction ? (
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          ) : (
            <AlertCircle className="w-6 h-6 text-amber-600" />
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-base font-bold">
            {status.hasRevenueAction ? 'Daily Revenue Requirement Satisfied' : 'Action Required for Today'}
          </h3>
          <p className="text-xs font-medium mt-0.5 opacity-90">{status.message}</p>
        </div>
      </div>

      {/* 3 Revenue Lanes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pipeline Lane */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Lane 1: Pipeline
            </span>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {status.pipelineCount} Actions
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed min-h-[40px] font-medium">
            {REVENUE_LANE_DESCRIPTIONS['Pipeline']}
          </p>
        </div>

        {/* Conversion Lane */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Lane 2: Conversion
            </span>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {status.conversionCount} Actions
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed min-h-[40px] font-medium">
            {REVENUE_LANE_DESCRIPTIONS['Conversion']}
          </p>
        </div>

        {/* Delivery / Asset Lane */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Lane 3: Delivery / Asset
            </span>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {status.deliveryCount} Actions
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed min-h-[40px] font-medium">
            {REVENUE_LANE_DESCRIPTIONS['Delivery / Asset']}
          </p>
        </div>
      </div>

      {/* List of Evidence Logged Today */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Today's Recorded Evidence Proofs
          </h3>
          <span className="text-xs font-mono font-bold text-slate-500">
            {day.revenueEvidences.length} Entries
          </span>
        </div>

        <div className="p-6 space-y-3">
          {day.revenueEvidences.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 font-medium">
                No revenue evidence recorded yet. Click 'Log Revenue Evidence' to add proof.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {day.revenueEvidences.map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {ev.lane}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{ev.actionTitle}</h4>
                    <p className="text-xs text-slate-600 mt-1 font-medium">{ev.evidenceDetails}</p>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Impact Score</div>
                      <div className="text-sm font-bold text-emerald-700">{ev.commercialValueScore}/10</div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
