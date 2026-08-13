import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Shield,
  Filter,
  Flame,
  CheckCircle2,
  Compass,
  Repeat,
  RotateCcw,
  AlertOctagon,
  Target,
  Sparkles,
  Zap,
  Check,
  HeartHandshake,
  Activity,
  Layers,
  HelpCircle,
  TrendingUp,
  Brain,
  Droplets,
  Bed,
  Dumbbell
} from 'lucide-react';

interface RuleItem {
  id: string;
  code: string;
  title: string;
  provenance: 'USER-DEFINED' | 'SOURCE-DERIVED' | 'SYSTEM-GENERATED';
  category: 'CORE' | 'REVENUE' | 'FOCUS' | 'STATE' | 'EXPLORATION';
  summary: string;
}

const RULES_DATA: RuleItem[] = [
  {
    id: '1',
    code: 'R-001',
    title: 'One Primary Direction',
    provenance: 'USER-DEFINED',
    category: 'CORE',
    summary: 'Maintain one current primary direction. Secondary ideas do not displace the primary objective without deliberate review.',
  },
  {
    id: '2',
    code: 'R-002',
    title: 'One Active Task',
    provenance: 'USER-DEFINED',
    category: 'FOCUS',
    summary: 'Only one task can be active at a time. New ideas are captured into the Later Queue without context switching.',
  },
  {
    id: '3',
    code: 'R-003',
    title: 'Daily Revenue Action',
    provenance: 'USER-DEFINED',
    category: 'REVENUE',
    summary: 'Every normal working day must contain at least one recorded revenue-generation action (Outreach, Sales Call, Proposal, Asset).',
  },
  {
    id: '4',
    code: 'R-004',
    title: '3-Hour Protected Focus Block',
    provenance: 'USER-DEFINED',
    category: 'FOCUS',
    summary: 'Protect approximately 3 hours for uninterrupted deep work dedicated primarily to the current revenue objective.',
  },
  {
    id: '5',
    code: 'R-005',
    title: 'Top 3 Daily Actions',
    provenance: 'USER-DEFINED',
    category: 'CORE',
    summary: 'A day contains up to three priority actions. Execution is measured against completing these priorities.',
  },
  {
    id: '6',
    code: 'R-006',
    title: 'Discipline Over Motivation',
    provenance: 'SOURCE-DERIVED',
    category: 'CORE',
    summary: 'Motivation is unreliable. Discipline keeps action going regardless of temporary mood or feelings.',
  },
  {
    id: '7',
    code: 'R-007',
    title: 'Baseline Before Optimization',
    provenance: 'SOURCE-DERIVED',
    category: 'STATE',
    summary: 'Measure current state before trying to optimize it: Measure -> Define Desired State -> Act -> Measure Again.',
  },
  {
    id: '8',
    code: 'R-008',
    title: 'State Reset Protocol',
    provenance: 'USER-DEFINED',
    category: 'STATE',
    summary: 'Upon overwhelm/confusion: STOP -> NAME -> LOCATE -> SEPARATE -> RESET -> RETURN. Return to one small action.',
  },
  {
    id: '9',
    code: 'R-009',
    title: 'Exploration with Declared Purpose',
    provenance: 'USER-DEFINED',
    category: 'EXPLORATION',
    summary: 'Curiosity and experimentation are permitted provided they have a declared commercial, capability, or asset purpose.',
  },
  {
    id: '10',
    code: 'R-010',
    title: 'Zero Manufactured Scores or Shame',
    provenance: 'USER-DEFINED',
    category: 'CORE',
    summary: 'Never use shame, guilt, or arbitrary single productivity scores. Record objective evidence and learn from deviation.',
  },
];

export const SourcesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedProvenance, setSelectedProvenance] = useState<string>('ALL');

  const filteredRules = RULES_DATA.filter((rule) => {
    const matchesSearch =
      rule.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'ALL' || rule.category === selectedCategory;
    const matchesProv = selectedProvenance === 'ALL' || rule.provenance === selectedProvenance;

    return matchesSearch && matchesCat && matchesProv;
  });

  return (
    <div className="space-y-8 pb-20 md:pb-8">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
            Monk-Like Discipline Operating System
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Rules, Principles & System Blueprint
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            One Focus. One Direction. Freedom in Future. Discipline is the bridge between current self and future self.
          </p>
        </div>
      </div>

      {/* VISUAL BLUEPRINT SECTION 1: DISCIPLINE FRAMEWORK & DOUBLE DIAMOND CHECK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* The 6-Step Discipline Cycle (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-400" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                The 6-Step Discipline Framework
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Continuous Iteration</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80 text-center">
              <div className="text-[10px] font-mono font-bold text-amber-400 uppercase">1. Clarity</div>
              <div className="text-xs font-extrabold text-white mt-1">Know Where I'm Going</div>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80 text-center">
              <div className="text-[10px] font-mono font-bold text-blue-400 uppercase">2. Plan</div>
              <div className="text-xs font-extrabold text-white mt-1">Design My Day & System</div>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80 text-center">
              <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase">3. Execute</div>
              <div className="text-xs font-extrabold text-white mt-1">Do What Matters Daily</div>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80 text-center">
              <div className="text-[10px] font-mono font-bold text-purple-400 uppercase">4. Measure</div>
              <div className="text-xs font-extrabold text-white mt-1">Track What Matters</div>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80 text-center">
              <div className="text-[10px] font-mono font-bold text-rose-400 uppercase">5. Review</div>
              <div className="text-xs font-extrabold text-white mt-1">Learn & Improve</div>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700/80 text-center">
              <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase">6. Repeat</div>
              <div className="text-xs font-extrabold text-white mt-1">Consistency for Years</div>
            </div>
          </div>

          <p className="text-xs text-slate-300 italic pt-2 border-t border-slate-800/80 text-center">
            "Discipline is the bridge between current self and future self."
          </p>
        </div>

        {/* Double Diamond Filter (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 text-white rounded-xl p-6 border border-amber-500/30 shadow-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Double Diamond Check
              </h2>
            </div>

            <div className="space-y-3 mt-4">
              <div className="p-3 bg-slate-800/90 rounded-lg border border-slate-700 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">1. Am I working on my ONE THING?</span>
                <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded">Filter #1</span>
              </div>
              <div className="p-3 bg-slate-800/90 rounded-lg border border-slate-700 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">2. Will this create value & revenue?</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded">Filter #2</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-emerald-950/80 rounded-lg border border-emerald-500/40 text-center">
            <span className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider">
              If YES → Do It Consistently! Everything else is secondary.
            </span>
          </div>
        </div>
      </div>

      {/* VISUAL BLUEPRINT SECTION 2: STOP COLLECTING ROCKS vs DRIFT RESET SYSTEM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stop Collecting Rocks (Distraction Filter) */}
        <div className="bg-white rounded-xl p-6 border border-rose-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-sm border-b border-rose-100 pb-2">
            <AlertOctagon className="w-5 h-5 text-rose-600" />
            <span>Stop Collecting Rocks (Broke / Distracted Trap)</span>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-medium pt-1">
            <li className="flex items-center gap-2 p-2 bg-rose-50/50 rounded border border-rose-100">
              <span className="text-rose-500 font-bold">✕</span> Random courses & tutorials
            </li>
            <li className="flex items-center gap-2 p-2 bg-rose-50/50 rounded border border-rose-100">
              <span className="text-rose-500 font-bold">✕</span> Tool hopping & app chasing
            </li>
            <li className="flex items-center gap-2 p-2 bg-rose-50/50 rounded border border-rose-100">
              <span className="text-rose-500 font-bold">✕</span> Mindless YouTube & feeds
            </li>
            <li className="flex items-center gap-2 p-2 bg-rose-50/50 rounded border border-rose-100">
              <span className="text-rose-500 font-bold">✕</span> Endless planning & no execution
            </li>
            <li className="flex items-center gap-2 p-2 bg-rose-50/50 rounded border border-rose-100">
              <span className="text-rose-500 font-bold">✕</span> Social media scrolling
            </li>
            <li className="flex items-center gap-2 p-2 bg-rose-50/50 rounded border border-rose-100">
              <span className="text-rose-500 font-bold">✕</span> Comparison & excuses
            </li>
          </ul>
        </div>

        {/* When I Drift (Reset Protocol) */}
        <div className="bg-white rounded-xl p-6 border border-blue-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-blue-800 font-bold text-sm border-b border-blue-100 pb-2">
            <RotateCcw className="w-5 h-5 text-blue-600" />
            <span>When I Drift (State Reset Protocol)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center pt-1">
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <div className="text-[10px] font-mono font-bold text-blue-600 uppercase">1. Notice</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">I drifted</div>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <div className="text-[10px] font-mono font-bold text-amber-600 uppercase">2. Pause</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">Breathe & step back</div>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <div className="text-[10px] font-mono font-bold text-emerald-600 uppercase">3. Accept</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">No guilt</div>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <div className="text-[10px] font-mono font-bold text-purple-600 uppercase">4. Action</div>
              <div className="text-xs font-bold text-slate-800 mt-0.5">Take next step</div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 italic text-center pt-1">
            Progress &gt; Perfection. Returning quickly is the real power.
          </p>
        </div>
      </div>

      {/* VISUAL BLUEPRINT SECTION 3: DAILY NON-NEGOTIABLES & 11 BUCKETS */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
              11 Core Discipline Tracking Buckets
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Foundation Practices</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <Brain className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <div className="text-xs font-bold text-slate-900">Spiritual Practice</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Meditation / Calm</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <HeartHandshake className="w-5 h-5 text-rose-600 mx-auto mb-1" />
            <div className="text-xs font-bold text-slate-900">Gratitude</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Daily Perspective</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <Dumbbell className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-xs font-bold text-slate-900">Exercise</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Strong Body</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <Activity className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <div className="text-xs font-bold text-slate-900">Diet & Nutrition</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Clean Fuel</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <Bed className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
            <div className="text-xs font-bold text-slate-900">Sleep</div>
            <div className="text-[10px] text-slate-500 mt-0.5">7+ Hours Rest</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <Target className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <div className="text-xs font-bold text-slate-900">Deep Work</div>
            <div className="text-[10px] text-slate-500 mt-0.5">3-Hour Blocks</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <BookOpen className="w-5 h-5 text-cyan-600 mx-auto mb-1" />
            <div className="text-xs font-bold text-slate-900">Learning</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Focused Reading</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <HeartHandshake className="w-5 h-5 text-pink-600 mx-auto mb-1" />
            <div className="text-xs font-bold text-slate-900">Relationships</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Family & Connect</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <TrendingUp className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <div className="text-xs font-bold text-slate-900">Finances</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Revenue Activity</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <Sparkles className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <div className="text-xs font-bold text-slate-900">Service</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Help 1 Person</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
            <Zap className="w-5 h-5 text-blue-500 mx-auto mb-1" />
            <div className="text-xs font-bold text-slate-900">Creativity</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Building Assets</div>
          </div>
        </div>
      </div>

      {/* SECTION 4: SEARCHABLE RULES DATABASE */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider">
            Active Operating Rules Code
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rules..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:outline-none focus:border-blue-600 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-[10px] uppercase font-bold text-slate-500">Category:</span>
          {(['ALL', 'CORE', 'REVENUE', 'FOCUS', 'STATE', 'EXPLORATION'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {filteredRules.map((rule) => (
            <div
              key={rule.id}
              className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {rule.code}
                  </span>
                  <span
                    className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                      rule.provenance === 'USER-DEFINED'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {rule.provenance}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-1">{rule.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">{rule.summary}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-medium">
                <span>Category: {rule.category}</span>
                <span className="text-blue-600 font-bold">Active</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
