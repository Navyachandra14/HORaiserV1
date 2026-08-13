import React, { useState } from 'react';
import { RevenueEvidence } from '../types';
import { REVENUE_LANE_DESCRIPTIONS } from '../rules/revenueRules';
import { X, TrendingUp, CheckCircle } from 'lucide-react';

interface RevenueEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEvidence: (evidence: Omit<RevenueEvidence, 'id' | 'timestamp' | 'dateStr' | 'verified'>) => void;
}

export const RevenueEvidenceModal: React.FC<RevenueEvidenceModalProps> = ({
  isOpen,
  onClose,
  onSaveEvidence,
}) => {
  const [actionTitle, setActionTitle] = useState('');
  const [lane, setLane] = useState<'Pipeline' | 'Conversion' | 'Delivery / Asset'>('Pipeline');
  const [evidenceDetails, setEvidenceDetails] = useState('');
  const [commercialValueScore, setCommercialValueScore] = useState(8);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionTitle.trim() || !evidenceDetails.trim()) {
      alert('Please fill out the action title and evidence proof details.');
      return;
    }

    onSaveEvidence({
      actionTitle,
      lane,
      evidenceDetails,
      commercialValueScore,
    });

    setActionTitle('');
    setEvidenceDetails('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="revenue-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Close Revenue Evidence Modal"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
            <TrendingUp className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h2 id="revenue-modal-title" className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Log Revenue Evidence
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Record concrete evidence of pipeline creation, conversion, or sellable assets.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Revenue Action Performed *
            </label>
            <input
              type="text"
              value={actionTitle}
              onChange={(e) => setActionTitle(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 placeholder-slate-400 font-medium focus:border-blue-600 focus:bg-white focus:outline-none"
              placeholder="e.g., Sent 5 personalized outreach pitches to qualified leads"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Revenue Lane
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Pipeline', 'Conversion', 'Delivery / Asset'] as const).map((l) => (
                <button
                  type="button"
                  key={l}
                  onClick={() => setLane(l)}
                  className={`p-2.5 rounded-lg border text-center text-xs font-bold transition-all ${
                    lane === l
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-blue-800 mt-1.5 font-medium italic">
              {REVENUE_LANE_DESCRIPTIONS[lane]}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Evidence / Proof Details *
            </label>
            <textarea
              value={evidenceDetails}
              onChange={(e) => setEvidenceDetails(e.target.value)}
              required
              rows={3}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:border-blue-600 focus:bg-white focus:outline-none"
              placeholder="e.g. Sent emails to Leads A, B, C, D, E. Proposal doc uploaded. Received reply from Lead A."
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Commercial Value / Impact Score</span>
              <span className="text-blue-700">{commercialValueScore}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={commercialValueScore}
              onChange={(e) => setCommercialValueScore(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Record Evidence</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
