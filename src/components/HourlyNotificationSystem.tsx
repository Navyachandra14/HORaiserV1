import React from 'react';
import { UserSettings, DayRecord } from '../types';
import { useHourlyNotification } from '../hooks/useHourlyNotification';
import { Bell, X } from 'lucide-react';

interface HourlyNotificationSystemProps {
  settings: UserSettings | null;
  onUpdateSettings: (newSettings: UserSettings) => Promise<void>;
  todayDay: DayRecord;
  onOpenCheckIn: () => void;
}

export const HourlyNotificationSystem: React.FC<HourlyNotificationSystemProps> = ({
  settings,
  onUpdateSettings,
  todayDay,
  onOpenCheckIn,
}) => {
  const {
    bannerVisible,
    bannerMessage,
    handleSnooze,
    dismissBanner,
  } = useHourlyNotification({
    settings,
    onUpdateSettings,
    todayDay,
    onOpenCheckIn,
  });

  if (!bannerVisible) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-3 sm:right-6 left-3 sm:left-auto z-50 max-w-md w-[calc(100%-1.5rem)] sm:w-full bg-slate-900 text-white rounded-xl shadow-2xl border border-blue-500/40 p-4 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 text-blue-400 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
                Hourly Check-In Prompt
              </span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                Top of Hour
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium mt-1 leading-snug">
              {bannerMessage}
            </p>
          </div>
        </div>

        <button
          onClick={dismissBanner}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          title="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleSnooze(15)}
            className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
          >
            Snooze 15m
          </button>
          <button
            onClick={() => handleSnooze(30)}
            className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
          >
            Snooze 30m
          </button>
        </div>

        <button
          onClick={() => {
            dismissBanner();
            onOpenCheckIn();
          }}
          className="px-3.5 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
        >
          <span>Perform Check-In Now</span>
        </button>
      </div>
    </div>
  );
};
