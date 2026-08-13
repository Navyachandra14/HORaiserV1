import React, { useState, useEffect } from 'react';
import { DayRecord } from '../types';
import { Sparkles, RefreshCw, Quote, Copy, Check, Volume2, Sun, Sunset, Moon, Zap, Target, ShieldCheck } from 'lucide-react';

interface AffirmationComponentProps {
  day: DayRecord;
}

interface Affirmation {
  text: string;
  author: string;
  category: 'Revenue & Action' | 'High Focus & Discipline' | 'Vibration & Energy' | 'Calm & Resilience';
  timeContext: 'morning' | 'afternoon' | 'evening' | 'night' | 'any';
}

const BASE_AFFIRMATIONS: Affirmation[] = [
  // Morning / Opening Activation
  {
    text: "My direction is clear, my focus is protected, and my actions today compound into massive long-term value.",
    author: "Operating Intent",
    category: "High Focus & Discipline",
    timeContext: "morning",
  },
  {
    text: "I do not wait for momentum; I create momentum through swift, decisive execution on direct revenue activities.",
    author: "Revenue Principles",
    category: "Revenue & Action",
    timeContext: "morning",
  },
  {
    text: "Today's top priorities receive my unbroken, single-tasking energy before the world demands my attention.",
    author: "Focus Master",
    category: "High Focus & Discipline",
    timeContext: "morning",
  },

  // Afternoon / Midday Momentum
  {
    text: "Energy follows intention. I choose clarity over hurry, depth over distraction, and direct proof over motion.",
    author: "Vibration Calibration",
    category: "Vibration & Energy",
    timeContext: "afternoon",
  },
  {
    text: "One hour of deep, uninterrupted execution outweights ten hours of scattered, reactive busyness.",
    author: "Deep Work Doctrine",
    category: "High Focus & Discipline",
    timeContext: "afternoon",
  },
  {
    text: "Every outreach made and every product improvement built directly accelerates my revenue trajectory.",
    author: "Execution Engine",
    category: "Revenue & Action",
    timeContext: "afternoon",
  },

  // Evening / Integration
  {
    text: "I measure today not by exhaustion, but by alignment: Did my hours match my highest strategic objectives?",
    author: "Alignment Audit",
    category: "Calm & Resilience",
    timeContext: "evening",
  },
  {
    text: "Consistent daily execution is the highest form of self-respect. What was started today is anchored firmly.",
    author: "Discipline Compounder",
    category: "High Focus & Discipline",
    timeContext: "evening",
  },
  {
    text: "I release the tension of unresolved details and anchor into steady, high-vibration gratitude for today's proof.",
    author: "Vibration Balance",
    category: "Vibration & Energy",
    timeContext: "evening",
  },

  // Night / Restful Strategy
  {
    text: "A rested mind thinks clearly, acts decisively, and spot opportunities that exhaustion obscures.",
    author: "Strategic Recovery",
    category: "Calm & Resilience",
    timeContext: "night",
  },
  {
    text: "Tomorrow's victory is designed tonight in quiet clarity and unshakeable certainty.",
    author: "Visionary Mindset",
    category: "Vibration & Energy",
    timeContext: "night",
  },

  // Universal High-Impact
  {
    text: "Focus is saying no to a thousand good things so you can say an absolute yes to the single vital goal.",
    author: "Focus Directive",
    category: "High Focus & Discipline",
    timeContext: "any",
  },
  {
    text: "Action precedes motivation. Courage precedes confidence. Proof precedes growth.",
    author: "Operating Rule",
    category: "Revenue & Action",
    timeContext: "any",
  },
];

export const AffirmationComponent: React.FC<AffirmationComponentProps> = ({ day }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [timePeriod, setTimePeriod] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');

  // Determine time of day dynamically
  useEffect(() => {
    const updateTimeContext = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) setTimePeriod('morning');
      else if (hour >= 12 && hour < 17) setTimePeriod('afternoon');
      else if (hour >= 17 && hour < 22) setTimePeriod('evening');
      else setTimePeriod('night');
    };

    updateTimeContext();
    const interval = setInterval(updateTimeContext, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Build dynamic context-aware pool of affirmations
  const getContextualAffirmations = (): Affirmation[] => {
    const pool = [...BASE_AFFIRMATIONS];

    // If a revenue objective is set, add a bespoke objective-aligned affirmation
    if (day.revenueObjective && day.revenueObjective.trim()) {
      pool.unshift({
        text: `My primary revenue objective is "${day.revenueObjective}". Every focus block today moves me closer to achieving it.`,
        author: "Target Objective Alignment",
        category: "Revenue & Action",
        timeContext: "any",
      });
    }

    // Filter or prioritize based on current time period
    const matchedTime = pool.filter((a) => a.timeContext === timePeriod || a.timeContext === 'any');
    return matchedTime.length > 0 ? matchedTime : pool;
  };

  const affirmationsList = getContextualAffirmations();
  const currentAffirmation = affirmationsList[currentIndex % affirmationsList.length] || BASE_AFFIRMATIONS[0];

  // Auto-rotate affirmation every 45 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % affirmationsList.length);
    }, 45000);
    return () => clearInterval(timer);
  }, [affirmationsList.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % affirmationsList.length);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${currentAffirmation.text}" — ${currentAffirmation.author}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentAffirmation.text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const getTimeBadge = () => {
    switch (timePeriod) {
      case 'morning':
        return { label: 'Morning Activation', icon: <Sun className="w-3.5 h-3.5 text-amber-500" />, bg: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'afternoon':
        return { label: 'Midday Execution', icon: <Zap className="w-3.5 h-3.5 text-blue-500" />, bg: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'evening':
        return { label: 'Evening Integration', icon: <Sunset className="w-3.5 h-3.5 text-indigo-500" />, bg: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      case 'night':
        return { label: 'Night Calibration', icon: <Moon className="w-3.5 h-3.5 text-purple-500" />, bg: 'bg-purple-50 text-purple-800 border-purple-200' };
    }
  };

  const timeBadge = getTimeBadge();

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-5 sm:p-6 border border-slate-800 shadow-md relative overflow-hidden transition-all">
      {/* Decorative background lighting */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/20 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>Goal-Aligned Affirmation</span>
          </span>

          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded border flex items-center gap-1.5 ${timeBadge.bg}`}>
            {timeBadge.icon}
            <span>{timeBadge.label}</span>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {'speechSynthesis' in window && (
            <button
              type="button"
              onClick={handleSpeak}
              className={`p-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isSpeaking
                  ? 'bg-rose-500/20 text-rose-300 border-rose-400/40 animate-pulse'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title={isSpeaking ? 'Stop speaking' : 'Read affirmation aloud'}
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1"
            title="Copy affirmation to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="px-2.5 py-1.5 rounded-lg bg-blue-600/80 hover:bg-blue-600 text-white border border-blue-500/50 text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
            title="Cycle next affirmation"
          >
            <RefreshCw className="w-3 h-3 text-white" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Quote Display Area */}
      <div className="relative z-10 my-2">
        <div className="flex gap-3 items-start">
          <Quote className="w-6 h-6 text-indigo-400/40 shrink-0 mt-1 rotate-180" />
          <div className="space-y-2">
            <p className="text-base sm:text-lg font-semibold leading-relaxed text-slate-100 tracking-tight">
              {currentAffirmation.text}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="text-xs font-bold text-amber-300/90 font-mono">
                — {currentAffirmation.author}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] font-mono uppercase bg-slate-800/90 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                {currentAffirmation.category}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
