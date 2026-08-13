import React, { useState, useEffect, useCallback } from 'react';
import { DayRecord, UserSettings, CheckIn, RevenueEvidence, IdeaItem, FocusBlock } from './types';
import { db } from './storage/db';
import { getTodayDateStr, createInitialDay } from './rules/dailyRules';
import { Navbar, TabType } from './components/Navbar';
import { CommandCenterPage } from './pages/CommandCenterPage';
import { TimelinePage } from './pages/TimelinePage';
import { RevenuePage } from './pages/RevenuePage';
import { DailyReviewPage } from './pages/DailyReviewPage';
import { SourcesPage } from './pages/SourcesPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { HourlyCheckInModal } from './components/HourlyCheckInModal';
import { RevenueEvidenceModal } from './components/RevenueEvidenceModal';
import { StateResetModal } from './components/StateResetModal';
import { IdeaCaptureDrawer } from './components/IdeaCaptureDrawer';
import { ImportExportModal } from './components/ImportExportModal';
import { HourlyNotificationSystem } from './components/HourlyNotificationSystem';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('today');
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [todayDay, setTodayDay] = useState<DayRecord | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isIdeaDrawerOpen, setIsIdeaDrawerOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);

  const todayDateStr = getTodayDateStr();

  // Load Initial Settings & Today's Record from IndexedDB
  const loadInitialData = useCallback(async () => {
    try {
      const userSettings = await db.getSettings();
      setSettings(userSettings);

      let day = await db.getDay(todayDateStr);
      if (!day) {
        day = createInitialDay(todayDateStr, userSettings);
        await db.saveDay(day);
      }
      setTodayDay(day);
    } catch (err) {
      console.error('Error loading HORaiser data:', err);
    } finally {
      setLoading(false);
    }
  }, [todayDateStr]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Register PWA Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('SW registration failed:', err);
      });
    }
  }, []);

  // Update Today Record helper
  const handleUpdateDay = async (updated: DayRecord) => {
    setTodayDay(updated);
    await db.saveDay(updated);
  };

  // Check-In Save Handler
  const handleSaveCheckIn = async (checkInData: Omit<CheckIn, 'id' | 'timestamp' | 'dateStr'>) => {
    if (!todayDay) return;

    const newCheckIn: CheckIn = {
      ...checkInData,
      id: `ci_${Date.now()}`,
      dateStr: todayDay.dateStr,
      timestamp: new Date().toISOString(),
    };

    const updatedDay: DayRecord = {
      ...todayDay,
      checkIns: [...todayDay.checkIns, newCheckIn],
    };

    await handleUpdateDay(updatedDay);
  };

  // Revenue Evidence Save Handler
  const handleSaveRevenueEvidence = async (evidenceData: Omit<RevenueEvidence, 'id' | 'timestamp' | 'dateStr' | 'verified'>) => {
    if (!todayDay) return;

    const newEvidence: RevenueEvidence = {
      ...evidenceData,
      id: `rev_${Date.now()}`,
      dateStr: todayDay.dateStr,
      timestamp: new Date().toISOString(),
      verified: true,
    };

    const updatedDay: DayRecord = {
      ...todayDay,
      revenueEvidences: [...todayDay.revenueEvidences, newEvidence],
    };

    await handleUpdateDay(updatedDay);
  };

  // Idea Capture Save Handler
  const handleSaveIdea = async (ideaData: Omit<IdeaItem, 'id' | 'timestamp' | 'dateStr' | 'status'>) => {
    if (!todayDay) return;

    const newIdea: IdeaItem = {
      ...ideaData,
      id: `idea_${Date.now()}`,
      dateStr: todayDay.dateStr,
      timestamp: new Date().toISOString(),
      status: 'Captured',
    };

    const updatedDay: DayRecord = {
      ...todayDay,
      ideas: [...todayDay.ideas, newIdea],
    };

    await handleUpdateDay(updatedDay);
  };

  // Update User Settings
  const handleUpdateSettings = async (newSettings: UserSettings) => {
    setSettings(newSettings);
    await db.saveSettings(newSettings);
  };

  // Notification Modal Trigger
  const handleToggleNotifications = () => {
    setIsNotifModalOpen(true);
  };

  // Reset Day State Handler
  const handleResetDayState = async () => {
    if (!settings || !todayDay) return;
    if (window.confirm('Reset today\'s state, check-ins, and focus block? Your primary settings will remain.')) {
      const freshDay = createInitialDay(todayDateStr, settings);
      setTodayDay(freshDay);
      await db.saveDay(freshDay);
    }
  };

  if (loading || !todayDay) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4" />
        <span className="font-bold text-sm text-slate-700 tracking-tight">
          Initializing HORaiser Personal Operating System...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col md:flex-row font-sans overflow-x-hidden">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCheckIn={() => setIsCheckInOpen(true)}
        onOpenImportExport={() => setIsImportExportOpen(true)}
        onResetDay={handleResetDayState}
        onToggleNotifications={handleToggleNotifications}
        notificationsEnabled={Boolean(settings?.notifications.enabled)}
        dateStr={todayDay.dateStr}
      />

      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Professional Top Header Bar for Desktop */}
        <header className="h-16 bg-white border-b border-slate-200 hidden md:flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center space-x-3">
            <h1 className="text-base font-bold text-slate-800 tracking-tight">Operating Workspace</h1>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-bold uppercase tracking-wider">
              Local Mode
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsCheckInOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <span>Hourly Check-In</span>
            </button>
          </div>
        </header>

        {/* Main Workspace Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'today' && (
            <CommandCenterPage
              day={todayDay}
              onUpdateDay={handleUpdateDay}
              onOpenCheckIn={() => setIsCheckInOpen(true)}
              onOpenRevenueModal={() => setIsRevenueModalOpen(true)}
              onOpenResetModal={() => setIsResetModalOpen(true)}
              onOpenIdeaCapture={() => setIsIdeaDrawerOpen(true)}
              onNavigateToTab={setActiveTab}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelinePage
              day={todayDay}
              onOpenCheckIn={() => setIsCheckInOpen(true)}
              onOpenIdeaCapture={() => setIsIdeaDrawerOpen(true)}
            />
          )}

          {activeTab === 'revenue' && (
            <RevenuePage
              day={todayDay}
              onOpenRevenueModal={() => setIsRevenueModalOpen(true)}
            />
          )}

          {activeTab === 'review' && (
            <DailyReviewPage
              day={todayDay}
              onUpdateDay={handleUpdateDay}
            />
          )}

          {activeTab === 'rules' && <SourcesPage />}

          {activeTab === 'analytics' && <AnalyticsPage />}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <HourlyCheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSaveCheckIn={handleSaveCheckIn}
        revenueObjective={todayDay?.revenueObjective}
      />

      <RevenueEvidenceModal
        isOpen={isRevenueModalOpen}
        onClose={() => setIsRevenueModalOpen(false)}
        onSaveEvidence={handleSaveRevenueEvidence}
      />

      <StateResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onCompleteReset={() => {
          console.log('State reset protocol completed.');
        }}
      />

      <IdeaCaptureDrawer
        isOpen={isIdeaDrawerOpen}
        onClose={() => setIsIdeaDrawerOpen(false)}
        onSaveIdea={handleSaveIdea}
      />

      <ImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        onDataImported={loadInitialData}
      />

      {/* Hourly Background Notification Scheduler */}
      <HourlyNotificationSystem
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        todayDay={todayDay}
        onOpenCheckIn={() => setIsCheckInOpen(true)}
      />

      {/* Notification Settings & Test Trigger Modal */}
      <NotificationSettingsModal
        isOpen={isNotifModalOpen}
        onClose={() => setIsNotifModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onTestNotification={() => {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Time for Hourly Check-In ⏰ (Test)', {
              body: 'This is a test hourly alert. Take 30s to log your activity, focus, and state.',
              icon: '/favicon.ico',
            });
          }
        }}
      />
    </div>
  );
}
