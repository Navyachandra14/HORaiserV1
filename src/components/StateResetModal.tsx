import React, { useState, useEffect } from 'react';
import { RESET_PROTOCOL_STEPS } from '../rules/stateRules';
import { X, Play, RotateCcw, ArrowRight, ShieldCheck } from 'lucide-react';

interface StateResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteReset: () => void;
}

export const StateResetModal: React.FC<StateResetModalProps> = ({
  isOpen,
  onClose,
  onCompleteReset,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [breathTimer, setBreathTimer] = useState(60);
  const [isBreathRunning, setIsBreathRunning] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isBreathRunning && breathTimer > 0) {
      interval = setInterval(() => {
        setBreathTimer((prev) => prev - 1);
      }, 1000);
    } else if (breathTimer === 0) {
      setIsBreathRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathRunning, breathTimer]);

  useEffect(() => {
    let phaseInterval: NodeJS.Timeout | null = null;
    if (isBreathRunning) {
      phaseInterval = setInterval(() => {
        setBreathPhase((prev) => {
          if (prev === 'Inhale') return 'Hold';
          if (prev === 'Hold') return 'Exhale';
          if (prev === 'Exhale') return 'Pause';
          return 'Inhale';
        });
      }, 4000); // 4-second box breathing cycles
    }
    return () => {
      if (phaseInterval) clearInterval(phaseInterval);
    };
  }, [isBreathRunning]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      onCompleteReset();
      onClose();
    }
  };

  const handleResetBreath = () => {
    setBreathTimer(60);
    setIsBreathRunning(false);
    setBreathPhase('Inhale');
  };

  const activeStepData = RESET_PROTOCOL_STEPS.find((s) => s.step === currentStep)!;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="statereset-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-xl p-6 shadow-2xl relative overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Close State Reset Modal"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700 px-2.5 py-1 rounded bg-blue-50 border border-blue-100">
            State Reset Protocol
          </span>
          <h2 id="statereset-modal-title" className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
            Ground & Reset Internal State
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            STOP → NAME → LOCATE → SEPARATE → RESET → RETURN
          </p>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="grid grid-cols-6 gap-1.5 mb-6">
          {RESET_PROTOCOL_STEPS.map((s) => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`h-2 rounded-full transition-all ${
                s.step === currentStep
                  ? 'bg-blue-600 shadow-xs'
                  : s.step < currentStep
                  ? 'bg-blue-300'
                  : 'bg-slate-200'
              }`}
              title={`Step ${s.step}: ${s.code}`}
            />
          ))}
        </div>

        {/* Active Step Content */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 border border-blue-200 flex items-center justify-center font-bold text-sm">
              0{activeStepData.step}
            </span>
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-blue-700 font-bold">
                {activeStepData.code}
              </span>
              <h3 className="text-base font-bold text-slate-900">{activeStepData.title}</h3>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed font-medium">{activeStepData.instruction}</p>

          {/* Special Box Breathing Timer inside RESET step */}
          {activeStepData.code === 'RESET' && (
            <div className="mt-5 p-4 rounded-lg bg-white border border-blue-200 text-center shadow-xs">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
                Box Breathing Timer (4-4-4-4)
              </div>
              <div className="text-3xl font-mono font-extrabold text-slate-900 my-2">{breathTimer}s</div>

              {isBreathRunning && (
                <div className="my-3 flex items-center justify-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600 animate-ping" />
                  <span className="text-sm font-bold text-blue-800 uppercase tracking-widest">
                    {breathPhase} (4s)
                  </span>
                </div>
              )}

              <div className="flex justify-center gap-2 mt-3">
                <button
                  onClick={() => setIsBreathRunning(!isBreathRunning)}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isBreathRunning ? 'Pause' : 'Start 60s Breath'}</span>
                </button>
                <button
                  onClick={handleResetBreath}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs border border-slate-300"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-4 py-2 rounded-lg text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40"
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors"
          >
            {currentStep === 6 ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Complete Reset & Return to Task</span>
              </>
            ) : (
              <>
                <span>Next ({RESET_PROTOCOL_STEPS[currentStep]?.code})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
