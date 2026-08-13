import React, { useState } from 'react';
import { IdeaItem } from '../types';
import { X, Lightbulb, Check } from 'lucide-react';

interface IdeaCaptureDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveIdea: (idea: Omit<IdeaItem, 'id' | 'timestamp' | 'dateStr' | 'status'>) => void;
}

export const IdeaCaptureDrawer: React.FC<IdeaCaptureDrawerProps> = ({
  isOpen,
  onClose,
  onSaveIdea,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [potentialProblem, setPotentialProblem] = useState('');
  const [commercialConnection, setCommercialConnection] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please provide an idea title.');
      return;
    }

    onSaveIdea({
      title,
      description,
      targetAudience,
      potentialProblemSolved: potentialProblem,
      commercialConnection,
    });

    setTitle('');
    setDescription('');
    setTargetAudience('');
    setPotentialProblem('');
    setCommercialConnection('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ideacapture-drawer-title"
    >
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Close Idea Capture Drawer"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 shrink-0">
            <Lightbulb className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="ideacapture-drawer-title" className="text-xl font-extrabold text-slate-900 tracking-tight">
              Quick Idea Capture
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Capture new ideas into Later Queue without dropping active focus.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Idea Concept / Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm text-slate-900 placeholder-slate-400 font-medium focus:border-blue-600 focus:bg-white focus:outline-none"
              placeholder="e.g. Automated Whisper script for customer meeting notes"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description / Notes
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 font-medium focus:border-blue-600 focus:bg-white focus:outline-none"
              placeholder="What triggered this idea? What are key mechanics?"
            />
          </div>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
              Commercial Asset Validation Test
            </span>

            <div>
              <label className="block text-[11px] text-slate-600 font-medium mb-1">
                Target Audience (Who needs this?)
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-900 focus:border-blue-600 focus:outline-none"
                placeholder="e.g., Freelance agency owners / B2B sales reps"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-600 font-medium mb-1">
                Problem Solved (Why would they care?)
              </label>
              <input
                type="text"
                value={potentialProblem}
                onChange={(e) => setPotentialProblem(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-900 focus:border-blue-600 focus:outline-none"
                placeholder="e.g., Eliminates 2 hours of manual transcript editing"
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-600 font-medium mb-1">
                Revenue Connection
              </label>
              <input
                type="text"
                value={commercialConnection}
                onChange={(e) => setCommercialConnection(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-900 focus:border-blue-600 focus:outline-none"
                placeholder="e.g., Lead magnet or productized service add-on"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
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
              <Check className="w-4 h-4" />
              <span>Queue Idea & Return to Focus</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
