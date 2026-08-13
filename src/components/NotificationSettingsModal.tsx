import React, { useState } from 'react';
import { UserSettings } from '../types';
import { X, Bell, Volume2, VolumeX, Clock, ShieldCheck, Check, AlertCircle, Play, Sparkles } from 'lucide-react';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings | null;
  onUpdateSettings: (newSettings: UserSettings) => Promise<void>;
  onTestNotification: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onTestNotification,
}) => {
  const [testSent, setTestSent] = useState(false);
  const [permissionState, setPermissionState] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );

  if (!isOpen || !settings) return null;

  const handleToggleEnabled = async () => {
    if (!('Notification' in window)) {
      alert('Browser notifications API is not supported in this browser.');
      return;
    }

    if (Notification.permission !== 'granted') {
      const perm = await Notification.requestPermission();
      setPermissionState(perm);
      if (perm !== 'granted') {
        alert('Notification permission was not granted by browser.');
        return;
      }
    }

    const updated = {
      ...settings,
      notifications: {
        ...settings.notifications,
        enabled: !settings.notifications.enabled,
      },
    };
    await onUpdateSettings(updated);
  };

  const handleToggleSound = async () => {
    const updated = {
      ...settings,
      soundEnabled: !settings.soundEnabled,
    };
    await onUpdateSettings(updated);
  };

  const handleQuietHoursChange = async (field: 'quietHoursStart' | 'quietHoursEnd', value: string) => {
    const updated = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [field]: value,
      },
    };
    await onUpdateSettings(updated);
  };

  const handleTestTrigger = () => {
    onTestNotification();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notification-settings-title"
    >
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 text-blue-400" aria-hidden="true" />
            </div>
            <div>
              <h2 id="notification-settings-title" className="text-base font-bold text-white tracking-tight">
                Hourly Notification & Alert System
              </h2>
              <p className="text-xs text-slate-400">
                Configure hourly check-in reminders, audio chimes, and quiet hours.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Permission Status Banner */}
          <div className={`p-3.5 rounded-lg border text-xs font-semibold flex items-center justify-between gap-3 ${
            permissionState === 'granted'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-2">
              <ShieldCheck className={`w-4 h-4 ${permissionState === 'granted' ? 'text-emerald-600' : 'text-amber-600'}`} />
              <span>
                Browser Permission: <strong className="uppercase">{permissionState}</strong>
              </span>
            </div>

            {permissionState !== 'granted' && (
              <button
                onClick={async () => {
                  const perm = await Notification.requestPermission();
                  setPermissionState(perm);
                }}
                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold"
              >
                Grant Access
              </button>
            )}
          </div>

          {/* Toggle Switches */}
          <div className="space-y-3">
            {/* 1. Hourly Reminders Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div>
                <div className="text-xs font-bold text-slate-900">Hourly Check-In Reminders</div>
                <div className="text-[11px] text-slate-500">Prompts you every hour to record activity & state</div>
              </div>

              <button
                type="button"
                onClick={handleToggleEnabled}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.notifications.enabled ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            {/* 2. Audio Chime Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-2.5">
                {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                <div>
                  <div className="text-xs font-bold text-slate-900">Audio Chime Sound</div>
                  <div className="text-[11px] text-slate-500">Gentle two-tone chime played on hourly prompt</div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleSound}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.soundEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-xs" />
              </button>
            </div>
          </div>

          {/* Quiet Hours Configuration */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Quiet Hours (No Prompts)</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-bold mb-1">Start Time</label>
                <input
                  type="time"
                  value={settings.notifications.quietHoursStart || '22:00'}
                  onChange={(e) => handleQuietHoursChange('quietHoursStart', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 font-mono text-slate-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">End Time</label>
                <input
                  type="time"
                  value={settings.notifications.quietHoursEnd || '07:00'}
                  onChange={(e) => handleQuietHoursChange('quietHoursEnd', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 font-mono text-slate-800 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Manual Test Trigger */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-200">
            <button
              type="button"
              onClick={handleTestTrigger}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-blue-600" />
              <span>{testSent ? 'Test Alert Sent!' : 'Send Test Hourly Alert'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
