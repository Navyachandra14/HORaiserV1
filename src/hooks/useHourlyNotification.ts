import { useState, useEffect, useRef } from 'react';
import { UserSettings, DayRecord } from '../types';

interface UseHourlyNotificationProps {
  settings: UserSettings | null;
  onUpdateSettings: (newSettings: UserSettings) => Promise<void>;
  todayDay: DayRecord;
  onOpenCheckIn: () => void;
}

export const useHourlyNotification = ({
  settings,
  onUpdateSettings,
  todayDay,
  onOpenCheckIn,
}: UseHourlyNotificationProps) => {
  const [bannerVisible, setBannerVisible] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('Time for your Hourly Check-In! Log your activity and state.');
  const [snoozedUntil, setSnoozedUntil] = useState<number | null>(null);
  const [permissionState, setPermissionState] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'denied'
  );

  const lastNotifiedHourRef = useRef<number>(-1);

  // Play gentle Web Audio chime
  const playAudioChime = () => {
    if (settings?.soundEnabled === false) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Gentle two-note chime (E5 -> A5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now); // E5
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.5);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.15); // A5
      gain2.gain.setValueAtTime(0.2, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.9);
    } catch (err) {
      console.warn('Audio chime playback error:', err);
    }
  };

  const triggerHourlyPrompt = (customMessage?: string) => {
    // Respect snooze
    if (snoozedUntil && Date.now() < snoozedUntil) {
      return;
    }

    const message = customMessage || "Hourly Check-In Time! Log your activity, align focus, and verify revenue proof.";
    setBannerMessage(message);
    setBannerVisible(true);

    playAudioChime();

    // Respect userSettings 'notifications.enabled' AND browser permissions
    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted' &&
      settings?.notifications.enabled
    ) {
      try {
        const notif = new Notification('Time for Hourly Check-In ⏰', {
          body: message,
          icon: '/favicon.ico',
          tag: 'hourly-checkin-reminder',
          requireInteraction: true,
        });

        notif.onclick = () => {
          window.focus();
          onOpenCheckIn();
          setBannerVisible(false);
          notif.close();
        };
      } catch (e) {
        console.warn('Browser Notification trigger failed:', e);
      }
    }
  };

  // Schedule timer hook checking every 30 seconds
  useEffect(() => {
    const checkSchedule = () => {
      // STRICT CHECK: Respect userSettings notifications.enabled setting
      if (!settings?.notifications.enabled) return;

      const now = new Date();
      const currentHour = now.getHours();

      // Check Quiet Hours (e.g. "22:00" to "07:00")
      if (settings.notifications.quietHoursStart && settings.notifications.quietHoursEnd) {
        const [qStartHour] = settings.notifications.quietHoursStart.split(':').map(Number);
        const [qEndHour] = settings.notifications.quietHoursEnd.split(':').map(Number);

        if (qStartHour > qEndHour) {
          if (currentHour >= qStartHour || currentHour < qEndHour) return; // In quiet hours
        } else {
          if (currentHour >= qStartHour && currentHour < qEndHour) return; // In quiet hours
        }
      }

      // Check if we already notified for this hour
      if (lastNotifiedHourRef.current !== currentHour) {
        // If user logged a check-in within last 45 mins, skip
        const lastCheckIn = todayDay.checkIns?.[todayDay.checkIns.length - 1];
        if (lastCheckIn) {
          const lastTime = new Date(lastCheckIn.timestamp).getTime();
          const elapsedMins = (Date.now() - lastTime) / (1000 * 60);
          if (elapsedMins < 45) {
            lastNotifiedHourRef.current = currentHour;
            return;
          }
        }

        lastNotifiedHourRef.current = currentHour;
        triggerHourlyPrompt(`Top of the Hour (${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}): Time for your Hourly Check-In.`);
      }
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 30000);
    return () => clearInterval(interval);
  }, [settings?.notifications, todayDay.checkIns, snoozedUntil]);

  const handleRequestPermission = async () => {
    if (!('Notification' in window)) {
      alert('Browser notifications API is not supported in this browser.');
      return;
    }

    const perm = await Notification.requestPermission();
    setPermissionState(perm);

    if (perm === 'granted' && settings) {
      const updated = {
        ...settings,
        notifications: {
          ...settings.notifications,
          enabled: true,
        },
      };
      await onUpdateSettings(updated);
      triggerHourlyPrompt("Notifications enabled! You will be prompted every hour for check-ins.");
    }
  };

  const handleSnooze = (minutes: number) => {
    setSnoozedUntil(Date.now() + minutes * 60 * 1000);
    setBannerVisible(false);
  };

  return {
    bannerVisible,
    bannerMessage,
    snoozedUntil,
    permissionState,
    triggerHourlyPrompt,
    handleSnooze,
    dismissBanner: () => setBannerVisible(false),
    requestPermission: handleRequestPermission,
  };
};
