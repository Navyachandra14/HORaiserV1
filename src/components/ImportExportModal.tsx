import React, { useState } from 'react';
import { db } from '../storage/db';
import { X, Download, Upload, Copy, Check } from 'lucide-react';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataImported: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  onDataImported,
}) => {
  const [jsonText, setJsonText] = useState('');
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = async () => {
    const data = await db.exportJSON();
    setJsonText(data);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = async () => {
    const data = await db.exportJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `horaiser_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!jsonText.trim()) {
      setImportStatus('Error: Paste or upload valid JSON data first.');
      return;
    }

    const success = await db.importJSON(jsonText);
    if (success) {
      setImportStatus('Successfully restored HORaiser local data!');
      onDataImported();
      setTimeout(() => {
        setImportStatus(null);
        onClose();
      }, 1500);
    } else {
      setImportStatus('Failed to import JSON. Verify file format.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setJsonText(content);
    };
    reader.readAsText(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="importexport-modal-title"
    >
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="Close Backup and Restore Modal"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700 px-2.5 py-1 rounded bg-blue-50 border border-blue-100">
            Local Data Portability
          </span>
          <h2 id="importexport-modal-title" className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
            Backup & Restore (JSON)
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Zero cloud dependency. Export full database as local JSON or restore from backup.
          </p>
        </div>

        {importStatus && (
          <div
            className={`p-3 rounded-lg text-xs font-bold mb-4 ${
              importStatus.includes('Successfully')
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {importStatus}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 border border-slate-200"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Generate Export JSON</span>
            </button>

            <button
              onClick={handleDownloadFile}
              className="px-4 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5 border border-blue-200"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </button>

            <label className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 border border-slate-200 cursor-pointer">
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Load JSON File</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                JSON Content
              </label>
              {jsonText && (
                <button
                  onClick={handleCopy}
                  className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              rows={8}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 font-mono text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              placeholder="Click 'Generate Export JSON' to inspect data, or paste JSON here to restore backup..."
            />
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium">
              IndexedDB local storage: <span className="text-emerald-700 font-bold">Active</span>
            </span>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={handleImport}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Restore Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
