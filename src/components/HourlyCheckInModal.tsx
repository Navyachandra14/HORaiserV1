import React, { useState } from 'react';
import {
  ActivityCategory,
  CheckIn,
  EmotionTag,
  RevenueType,
  AlignmentRating,
} from '../types';
import { ALL_ACTIVITY_CATEGORIES } from '../rules/activityRules';
import { X, CheckCircle, Sparkles, Target, Zap } from 'lucide-react';

interface HourlyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCheckIn: (checkIn: Omit<CheckIn, 'id' | 'timestamp' | 'dateStr'>) => void;
  revenueObjective?: string;
}

const FEELING_OPTIONS: EmotionTag[] = [
  'calm',
  'focused',
  'confident',
  'excited',
  'peaceful',
  'frustrated',
  'angry',
  'anxious',
  'fearful',
  'overwhelmed',
  'avoidant',
  'uncertain',
  'tired',
  'motivated',
];

const QUICK_PRESETS = [
  {
    label: '🚀 Prospecting & Outreach',
    text: 'Researched target accounts and executed direct outreach messages.',
    category: 'Prospecting' as ActivityCategory,
    revenueType: 'Revenue Pipeline' as RevenueType,
  },
  {
    label: '💻 Core Building / Coding',
    text: 'Focused execution on high-value core asset development.',
    category: 'Core Work' as ActivityCategory,
    revenueType: 'Sellable Asset' as RevenueType,
  },
  {
    label: '📞 Client Delivery & Sales Call',
    text: 'Conducted live client meeting / proposal presentation.',
    category: 'Client Delivery' as ActivityCategory,
    revenueType: 'Conversion' as RevenueType,
  },
  {
    label: '🎯 Planning & Strategy',
    text: 'Refined project milestones and daily high-priority action roadmap.',
    category: 'Core Work' as ActivityCategory,
    revenueType: 'Not Revenue' as RevenueType,
  },
  {
    label: '📚 Skill Growth & Learning',
    text: 'Studied domain principles and high-leverage technical skills.',
    category: 'Exploration' as ActivityCategory,
    revenueType: 'Not Revenue' as RevenueType,
  },
  {
    label: '☕ Recharge & Walk',
    text: 'Took intentional restorative break to clear mental clarity and energy.',
    category: 'Admin' as ActivityCategory,
    revenueType: 'Not Revenue' as RevenueType,
  },
];

const VIBRATION_AFFIRMATIONS = [
  "I execute high commercial value with calm, effortless precision.",
  "Every focused action expands my energy, momentum, and financial freedom.",
  "I act with complete clarity and zero self-doubt.",
  "I convert time into tangible high-leverage progress."
];

export const HourlyCheckInModal: React.FC<HourlyCheckInModalProps> = ({
  isOpen,
  onClose,
  onSaveCheckIn,
  revenueObjective,
}) => {
  const [whatDidIDo, setWhatDidIDo] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('Core Work');
  const [aligned, setAligned] = useState<AlignmentRating>('Yes');
  const [revenueType, setRevenueType] = useState<RevenueType>('Not Revenue');

  const [mood, setMood] = useState(8);
  const [focus, setFocus] = useState(8);
  const [energy, setEnergy] = useState(8);
  const [calm, setCalm] = useState(8);
  const [confidence, setConfidence] = useState(8);
  const [vibration, setVibration] = useState(8);
  const [vibrationDesc, setVibrationDesc] = useState('');

  const [selectedFeelings, setSelectedFeelings] = useState<EmotionTag[]>(['focused', 'calm']);
  const [whatChanged, setWhatChanged] = useState('');
  const [nextAction, setNextAction] = useState('');

  const [showAffirmations, setShowAffirmations] = useState(false);
  const [activeAffirmation, setActiveAffirmation] = useState(0);

  if (!isOpen) return null;

  const applyPreset = (preset: typeof QUICK_PRESETS[0]) => {
    setWhatDidIDo(preset.text);
    setCategory(preset.category);
    setRevenueType(preset.revenueType);
    setAligned('Yes');
  };

  const boostState = () => {
    setVibration((v) => Math.min(10, v + 1));
    setEnergy((e) => Math.min(10, e + 1));
    setFocus((f) => Math.min(10, f + 1));
    setSelectedFeelings((prev) => Array.from(new Set([...prev, 'motivated', 'confident', 'focused'])));
  };

  const toggleFeeling = (tag: EmotionTag) => {
    if (selectedFeelings.includes(tag)) {
      setSelectedFeelings(selectedFeelings.filter((f) => f !== tag));
    } else {
      setSelectedFeelings([...selectedFeelings, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatDidIDo.trim()) {
      alert('Please describe or select what you did during the last hour.');
      return;
    }

    const d = new Date();
    const hourLabel = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    onSaveCheckIn({
      hourLabel,
      whatDidIDo,
      category,
      aligned,
      revenueType,
      state: {
        mood,
        focus,
        energy,
        calm,
        confidence,
        vibration,
        vibrationDescription: vibrationDesc,
        feelings: selectedFeelings,
        recordedAt: d.toISOString(),
      },
      whatChanged,
      nextAction: nextAction || 'Continue priority focus execution.',
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hourly-checkin-title"
    >
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Close Check-In Modal"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700 px-2.5 py-1 rounded bg-blue-50 border border-blue-100">
              Hourly Awareness Check-In
            </span>
          </div>
          <h2 id="hourly-checkin-title" className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            What Happened Last Hour?
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Record evidence with zero friction. Select a preset or type below.
          </p>
        </div>

        {/* Goal Realignment & Affirmation Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3.5 mb-5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
              <Target className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Today's Target Objective:</span>
            </div>
            <button
              type="button"
              onClick={() => setShowAffirmations(!showAffirmations)}
              className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-blue-200"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>{showAffirmations ? 'Hide Affirmations' : 'State & Vibration Booster'}</span>
            </button>
          </div>
          <p className="text-xs text-blue-800 font-semibold pl-6">
            {revenueObjective || 'Execute high-value priorities and maintain state alignment.'}
          </p>

          {showAffirmations && (
            <div className="mt-2 pl-6 pt-2 border-t border-blue-200/60 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-slate-700 italic">
                "{VIBRATION_AFFIRMATIONS[activeAffirmation]}"
              </p>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveAffirmation((a) => (a + 1) % VIBRATION_AFFIRMATIONS.length)}
                  className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-700 hover:bg-slate-50"
                >
                  Next
                </button>
                <button
                  type="button"
                  onClick={boostState}
                  className="px-2.5 py-1 bg-blue-600 text-white rounded text-[10px] font-bold hover:bg-blue-700 shadow-xs flex items-center gap-1"
                >
                  <Zap className="w-3 h-3" />
                  <span>Boost Vibration</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. What did I do? */}
          <div>
            <div className="mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. What did I do during the last hour? *
              </label>
            </div>

            {/* Fast Action Preset Chips */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {QUICK_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => applyPreset(preset)}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300 border border-slate-200 text-slate-700 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <textarea
              value={whatDidIDo}
              onChange={(e) => setWhatDidIDo(e.target.value)}
              required
              rows={2}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-900 placeholder-slate-400 font-medium focus:border-blue-600 focus:bg-white focus:outline-none"
              placeholder="Select a quick preset above, dictate with voice, or type custom activity..."
            />
          </div>

          {/* 2. Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              2. Activity Classification Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ALL_ACTIVITY_CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                    category === cat.name
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold text-slate-900">{cat.name}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{cat.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Aligned? & 4. Revenue Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                3. Aligned with Today's Priorities?
              </label>
              <div className="flex gap-2">
                {(['Yes', 'Partly', 'No'] as AlignmentRating[]).map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => setAligned(val)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                      aligned === val
                        ? val === 'Yes'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : val === 'Partly'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-rose-100 text-rose-900 border-rose-300'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                4. Revenue Lane Connection
              </label>
              <select
                value={revenueType}
                onChange={(e) => setRevenueType(e.target.value as RevenueType)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-medium text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none"
              >
                <option value="Not Revenue">Not Revenue-related</option>
                <option value="Direct Revenue">Direct Revenue Opportunity</option>
                <option value="Revenue Pipeline">Revenue Pipeline (Prospecting / Outreach)</option>
                <option value="Conversion">Conversion (Sales Call / Proposal)</option>
                <option value="Delivery">Client Delivery / Paid Fulfillment</option>
                <option value="Sellable Asset">Sellable Asset / Commercial Portfolio</option>
              </select>
            </div>
          </div>

          {/* 5-9. State Sliders */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center justify-between">
              <span>Internal State Metrics (1-10)</span>
              <span className="text-[10px] font-normal text-slate-500">Auto-calculated vibration</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs text-slate-700 font-bold mb-1">
                  <span>Mood</span>
                  <span className="text-blue-700">{mood}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={mood}
                  onChange={(e) => setMood(Number(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 font-bold mb-1">
                  <span>Focus</span>
                  <span className="text-blue-700">{focus}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={focus}
                  onChange={(e) => setFocus(Number(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 font-bold mb-1">
                  <span>Energy</span>
                  <span className="text-blue-700">{energy}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energy}
                  onChange={(e) => setEnergy(Number(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 font-bold mb-1">
                  <span>Calm</span>
                  <span className="text-blue-700">{calm}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={calm}
                  onChange={(e) => setCalm(Number(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 font-bold mb-1">
                  <span>Confidence</span>
                  <span className="text-blue-700">{confidence}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={confidence}
                  onChange={(e) => setConfidence(Number(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-700 font-bold mb-1">
                  <span>Subjective Vibration</span>
                  <span className="text-blue-700">{vibration}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={vibration}
                  onChange={(e) => setVibration(Number(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 10. Emotion Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              What feelings describe your current state?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {FEELING_OPTIONS.map((feeling) => {
                const active = selectedFeelings.includes(feeling);
                return (
                  <button
                    type="button"
                    key={feeling}
                    onClick={() => toggleFeeling(feeling)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                      active
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    #{feeling}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 11. Next Action */}
          <div>
            <div className="mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                What is your ONE next action for the coming hour? *
              </label>
            </div>
            <input
              type="text"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:border-blue-600 focus:bg-white focus:outline-none"
              placeholder="e.g. Write proposal for Lead A / Continue deep build session"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              Save Check-In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

