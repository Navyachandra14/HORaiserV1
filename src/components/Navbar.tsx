import React from 'react';
import { Logo } from './Logo';
import {
  LayoutDashboard,
  Clock,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  BarChart3,
  Download,
  Bell,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';

export type TabType = 'today' | 'timeline' | 'revenue' | 'review' | 'rules' | 'analytics';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenCheckIn: () => void;
  onOpenImportExport: () => void;
  onResetDay: () => void;
  onToggleNotifications: () => void;
  notificationsEnabled: boolean;
  dateStr: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCheckIn,
  onOpenImportExport,
  onResetDay,
  onToggleNotifications,
  notificationsEnabled,
  dateStr,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'today', label: 'Today', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'timeline', label: 'Timeline', icon: <Clock className="w-4 h-4" /> },
    { id: 'revenue', label: 'Revenue', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'review', label: 'Review', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'rules', label: 'Rules', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Desktop Sidebar Navigation (md+) */}
      <aside className="hidden md:flex w-60 bg-[#1E293B] flex-col text-slate-300 border-r border-slate-700/80 shrink-0 min-h-screen">
        {/* Sidebar Header */}
        <div
          className="h-16 flex items-center px-4 border-b border-amber-500/20 bg-slate-950/90 cursor-pointer hover:bg-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          onClick={() => setActiveTab('today')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab('today'); }}
          aria-label="HORAISER Dashboard Home"
        >
          <Logo size="sm" showSubtext={true} />
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto" aria-label="Main Desktop Navigation">
          {/* Primary Quick Action */}
          <div>
            <button
              onClick={onOpenCheckIn}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2.5 rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              aria-label="Perform Hourly Check-In"
            >
              <Clock className="w-4 h-4 text-white" aria-hidden="true" />
              <span>Hourly Check-In</span>
            </button>
          </div>

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
              Workspace
            </div>
            <div className="space-y-1" role="list">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Controls Section */}
          <div className="pt-3 border-t border-slate-700/80 space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-2">
              System
            </div>

            <button
              onClick={onToggleNotifications}
              aria-label={`Toggle Reminders, currently ${notificationsEnabled ? 'enabled' : 'disabled'}`}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                notificationsEnabled
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reminders</span>
              </div>
              <div className={`w-2 h-2 rounded-full ${notificationsEnabled ? 'bg-emerald-500' : 'bg-slate-600'}`} aria-hidden="true" />
            </button>

            <button
              onClick={onOpenImportExport}
              aria-label="Backup and restore data"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium hover:bg-slate-800 text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
              <span>Backup Data</span>
            </button>

            <button
              onClick={onResetDay}
              aria-label="Reset Today's Record"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium hover:bg-rose-950/40 text-rose-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Reset Today</span>
            </button>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3.5 border-t border-slate-700/80 bg-[#0F172A] flex items-center justify-between text-xs text-slate-400">
          <span>Local Storage</span>
          <span className="flex items-center text-emerald-400 text-[10px] font-bold uppercase">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5" />
            Offline Active
          </span>
        </div>
      </aside>

      {/* Mobile Header (sm and below) */}
      <header className="md:hidden sticky top-0 z-40 bg-slate-950/95 border-b border-amber-500/20 px-3 py-2 flex items-center justify-between shadow-md backdrop-blur-md">
        <div
          className="flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          onClick={() => setActiveTab('today')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab('today'); }}
          aria-label="HORAISER Dashboard Home"
        >
          <Logo size="sm" showSubtext={false} />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCheckIn}
            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label="Perform Hourly Check-In"
          >
            <Clock className="w-3.5 h-3.5 text-white" aria-hidden="true" />
            <span>Check-In</span>
          </button>

          <button
            onClick={onToggleNotifications}
            className={`p-1.5 rounded-lg border text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
              notificationsEnabled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            aria-label={`Toggle Reminders, currently ${notificationsEnabled ? 'enabled' : 'disabled'}`}
          >
            <Bell className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={onOpenImportExport}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            aria-label="Backup and restore data"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0F172A] border-t border-slate-800 px-2 py-1.5 shadow-lg" aria-label="Mobile Bottom Navigation">
        <div className="grid grid-cols-6 gap-0.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Navigate to ${item.label}`}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-[10px] font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  isActive
                    ? 'text-white bg-blue-600 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span aria-hidden="true">{item.icon}</span>
                <span className="mt-1 truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
