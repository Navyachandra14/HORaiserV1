/**
 * HORaiser — IndexedDB Local Storage Layer
 * Local-First, Zero Cloud, Offline Persistence
 */

import {
  DayRecord,
  CheckIn,
  FocusBlock,
  RevenueEvidence,
  IdeaItem,
  UserSettings,
  Top3Item
} from '../types';

const DB_NAME = 'horaiser_db';
const DB_VERSION = 1;

export const DEFAULT_SETTINGS: UserSettings = {
  primaryDirection:
    'Build a disciplined personal operating system and a focused income engine while developing high-value technology, automation, AI, communication, and problem-solving capabilities.',
  notifications: {
    enabled: false,
    checkInIntervalMinutes: 60,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
  },
  soundEnabled: true,
  theme: 'dark',
};

class HoraiserDB {
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor() {
    this.initDB();
  }

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not supported'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains('days')) {
          db.createObjectStore('days', { keyPath: 'dateStr' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn('IndexedDB failed to open, using localStorage fallback');
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  public async getDay(dateStr: string): Promise<DayRecord | null> {
    try {
      const db = await this.initDB();
      return new Promise((resolve) => {
        const tx = db.transaction('days', 'readonly');
        const store = tx.objectStore('days');
        const req = store.get(dateStr);
        req.onsuccess = () => resolve((req.result as DayRecord) || null);
        req.onerror = () => resolve(this.getFallbackDay(dateStr));
      });
    } catch {
      return this.getFallbackDay(dateStr);
    }
  }

  public async saveDay(day: DayRecord): Promise<void> {
    day.lastUpdated = new Date().toISOString();
    try {
      const db = await this.initDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('days', 'readwrite');
        const store = tx.objectStore('days');
        const req = store.put(day);
        req.onsuccess = () => {
          this.setFallbackDay(day);
          resolve();
        };
        req.onerror = () => {
          this.setFallbackDay(day);
          resolve();
        };
      });
    } catch {
      this.setFallbackDay(day);
    }
  }

  public async getAllDays(): Promise<DayRecord[]> {
    try {
      const db = await this.initDB();
      return new Promise((resolve) => {
        const tx = db.transaction('days', 'readonly');
        const store = tx.objectStore('days');
        const req = store.getAll();
        req.onsuccess = () => {
          const results = (req.result as DayRecord[]) || [];
          resolve(results.sort((a, b) => b.dateStr.localeCompare(a.dateStr)));
        };
        req.onerror = () => resolve(this.getFallbackAllDays());
      });
    } catch {
      return this.getFallbackAllDays();
    }
  }

  public async getSettings(): Promise<UserSettings> {
    try {
      const db = await this.initDB();
      return new Promise((resolve) => {
        const tx = db.transaction('settings', 'readonly');
        const store = tx.objectStore('settings');
        const req = store.get('user_settings');
        req.onsuccess = () => {
          if (req.result && req.result.value) {
            resolve({ ...DEFAULT_SETTINGS, ...req.result.value });
          } else {
            resolve(this.getFallbackSettings());
          }
        };
        req.onerror = () => resolve(this.getFallbackSettings());
      });
    } catch {
      return this.getFallbackSettings();
    }
  }

  public async saveSettings(settings: UserSettings): Promise<void> {
    try {
      const db = await this.initDB();
      return new Promise((resolve) => {
        const tx = db.transaction('settings', 'readwrite');
        const store = tx.objectStore('settings');
        const req = store.put({ key: 'user_settings', value: settings });
        req.onsuccess = () => {
          this.setFallbackSettings(settings);
          resolve();
        };
        req.onerror = () => {
          this.setFallbackSettings(settings);
          resolve();
        };
      });
    } catch {
      this.setFallbackSettings(settings);
    }
  }

  // Backup Export & Import
  public async exportJSON(): Promise<string> {
    const days = await this.getAllDays();
    const settings = await this.getSettings();
    const payload = {
      app: 'HORaiser',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      days,
    };
    return JSON.stringify(payload, null, 2);
  }

  public async importJSON(jsonStr: string): Promise<boolean> {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed.days || !Array.isArray(parsed.days)) {
        throw new Error('Invalid HORaiser backup format: missing days array');
      }
      for (const day of parsed.days) {
        if (day.dateStr) {
          await this.saveDay(day);
        }
      }
      if (parsed.settings) {
        await this.saveSettings(parsed.settings);
      }
      return true;
    } catch (err) {
      console.error('Import failed:', err);
      return false;
    }
  }

  // localStorage Fallback Helpers
  private getFallbackDay(dateStr: string): DayRecord | null {
    try {
      const raw = localStorage.getItem(`horaiser_day_${dateStr}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private setFallbackDay(day: DayRecord): void {
    try {
      localStorage.setItem(`horaiser_day_${day.dateStr}`, JSON.stringify(day));
    } catch (e) {
      console.error('localStorage quota exceeded', e);
    }
  }

  private getFallbackAllDays(): DayRecord[] {
    const list: DayRecord[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('horaiser_day_')) {
          const raw = localStorage.getItem(key);
          if (raw) list.push(JSON.parse(raw));
        }
      }
    } catch (e) {
      console.error(e);
    }
    return list.sort((a, b) => b.dateStr.localeCompare(a.dateStr));
  }

  private getFallbackSettings(): UserSettings {
    try {
      const raw = localStorage.getItem('horaiser_settings');
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  private setFallbackSettings(settings: UserSettings): void {
    try {
      localStorage.setItem('horaiser_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }
}

export const db = new HoraiserDB();
