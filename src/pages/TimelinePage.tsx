import React, { useState } from 'react';
import { DayRecord } from '../types';
import { Clock, TrendingUp, Lightbulb, ShieldAlert, CheckCircle2, Filter } from 'lucide-react';

interface TimelinePageProps {
  day: DayRecord;
  onOpenCheckIn: () => void;
  onOpenIdeaCapture: () => void;
}

export const TimelinePage: React.FC<TimelinePageProps> = ({
  day,
  onOpenCheckIn,
  onOpenIdeaCapture,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Combine check-ins, revenue evidences, and ideas into a unified chronological array
  const checkInEvents = day.checkIns.map((c) => ({
    id: c.id,
    type: 'CHECK_IN' as const,
    timestamp: c.timestamp,
    timeLabel: c.hourLabel,
    title: c.whatDidIDo,
    category: c.category,
    aligned: c.aligned,
    revenueType: c.revenueType,
    state: c.state,
    nextAction: c.nextAction,
  }));

  const revenueEvents = day.revenueEvidences.map((r) => ({
    id: r.id,
    type: 'REVENUE' as const,
    timestamp: r.timestamp,
    timeLabel: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    title: r.actionTitle,
    category: 'Revenue',
    details: r.evidenceDetails,
    lane: r.lane,
    score: r.commercialValueScore,
  }));

  const ideaEvents = day.ideas.map((i) => ({
    id: i.id,
    type: 'IDEA' as const,
    timestamp: i.timestamp,
    timeLabel: new Date(i.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    title: i.title,
    category: 'Idea Queue',
    description: i.description,
    audience: i.targetAudience,
    status: i.status,
  }));

  const allEvents = [...checkInEvents, ...revenueEvents, ...ideaEvents].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const filteredEvents = allEvents.filter((ev) => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'REVENUE') return ev.type === 'REVENUE' || ev.category === 'Revenue';
    if (filterCategory === 'CHECK_IN') return ev.type === 'CHECK_IN';
    if (filterCategory === 'IDEA') return ev.type === 'IDEA';
    return ev.category === filterCategory;
  });

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            Evidence Feed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Activity & Event Timeline
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Chronological record of hourly check-ins, focus execution, revenue actions, and ideas.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onOpenCheckIn}
            className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Clock className="w-4 h-4" />
            <span>Check-In Now</span>
          </button>
          <button
            onClick={onOpenIdeaCapture}
            className="px-3.5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Lightbulb className="w-4 h-4 text-blue-600" />
            <span>Queue Idea</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        {(['ALL', 'CHECK_IN', 'REVENUE', 'IDEA', 'Core Work', 'Build', 'Foundation'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap border transition-all ${
              filterCategory === cat
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat === 'ALL' ? 'All Events' : cat === 'CHECK_IN' ? 'Check-Ins' : cat === 'REVENUE' ? 'Revenue Proof' : cat === 'IDEA' ? 'Ideas Queued' : cat}
          </button>
        ))}
      </div>

      {/* Timeline Feed */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm">
          <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Events Recorded for Today</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Click 'Check-In Now' to log your first hourly check-in, or record a revenue evidence action.
          </p>
          <button
            onClick={onOpenCheckIn}
            className="mt-4 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 shadow-sm"
          >
            Log First Check-In
          </button>
        </div>
      ) : (
        <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6">
          {filteredEvents.map((ev) => (
            <div key={ev.id} className="relative group">
              {/* Timeline Dot */}
              <div
                className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white ${
                  ev.type === 'REVENUE'
                    ? 'border-emerald-500 bg-emerald-500'
                    : ev.type === 'CHECK_IN'
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-amber-500 bg-amber-500'
                }`}
              />

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                      {ev.timeLabel}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      {ev.category}
                    </span>
                    {ev.type === 'CHECK_IN' && ev.aligned && (
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ev.aligned === 'Yes'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        Aligned: {ev.aligned}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium">
                    {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{ev.title}</h3>

                {/* Type-Specific Details */}
                {ev.type === 'CHECK_IN' && ev.state && (
                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">State Scores</span>
                      <span className="font-semibold text-slate-800">
                        Mood {ev.state.mood} • Focus {ev.state.focus} • Calm {ev.state.calm}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Vibration</span>
                      <span className="font-bold text-blue-700">{ev.state.vibration}/10</span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 col-span-2">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Next Action</span>
                      <span className="font-semibold text-slate-800">{ev.nextAction}</span>
                    </div>
                  </div>
                )}

                {ev.type === 'REVENUE' && (
                  <div className="mt-3 text-xs text-slate-800 bg-emerald-50/80 p-3.5 rounded-lg border border-emerald-200">
                    <div className="font-bold text-emerald-800 mb-1">
                      Lane: {ev.lane} (Value Score: {ev.score}/10)
                    </div>
                    <p className="font-medium">{ev.details}</p>
                  </div>
                )}

                {ev.type === 'IDEA' && (
                  <div className="mt-3 text-xs text-slate-800 bg-blue-50/80 p-3.5 rounded-lg border border-blue-200">
                    <p className="italic font-medium">{ev.description}</p>
                    {ev.audience && <div className="text-[11px] font-bold text-blue-800 mt-1">Audience: {ev.audience}</div>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
