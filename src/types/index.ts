/**
 * HORaiser — Personal Operating System
 * Type Definitions
 */

export type ActivityCategory =
  | 'Revenue'
  | 'Core Work'
  | 'Client Delivery'
  | 'Build'
  | 'Communication'
  | 'Learning'
  | 'Exploration'
  | 'Parallel Productive Work'
  | 'Foundation'
  | 'Recovery'
  | 'Administration'
  | 'Unplanned'
  | 'Drift';

export type RevenueType =
  | 'Direct Revenue'
  | 'Revenue Pipeline'
  | 'Conversion'
  | 'Delivery'
  | 'Sellable Asset'
  | 'Not Revenue';

export type EmotionTag =
  | 'calm'
  | 'focused'
  | 'confident'
  | 'excited'
  | 'peaceful'
  | 'frustrated'
  | 'angry'
  | 'anxious'
  | 'fearful'
  | 'overwhelmed'
  | 'avoidant'
  | 'uncertain'
  | 'tired'
  | 'motivated';

export type AlignmentRating = 'Yes' | 'Partly' | 'No';

export interface StateMetrics {
  mood: number; // 1-10
  focus: number; // 1-10
  energy: number; // 1-10
  calm: number; // 1-10
  confidence: number; // 1-10
  vibration: number; // 1-10 (Subjective state level)
  vibrationDescription?: string;
  feelings: EmotionTag[];
  recordedAt: string; // ISO date string
}

export interface Top3Item {
  id: string;
  text: string;
  completed: boolean;
  category?: ActivityCategory;
}

export interface CheckIn {
  id: string;
  dateStr: string; // YYYY-MM-DD
  timestamp: string; // ISO date string
  hourLabel: string; // e.g. "10:00 AM"
  whatDidIDo: string;
  category: ActivityCategory;
  aligned: AlignmentRating;
  revenueType: RevenueType;
  state: StateMetrics;
  whatChanged: string;
  nextAction: string;
}

export interface FocusBlock {
  id: string;
  dateStr: string;
  title: string;
  targetMinutes: number; // default 180 (3 hours)
  elapsedSeconds: number;
  completed: boolean;
  activeTaskId?: string;
  activeTaskTitle?: string;
  startedAt?: string;
  endedAt?: string;
  notes?: string;
}

export interface RevenueEvidence {
  id: string;
  dateStr: string;
  timestamp: string;
  actionTitle: string;
  lane: 'Pipeline' | 'Conversion' | 'Delivery / Asset';
  evidenceDetails: string;
  commercialValueScore: number; // 1-10
  verified: boolean;
}

export interface IdeaItem {
  id: string;
  dateStr: string;
  timestamp: string;
  title: string;
  description: string;
  targetAudience?: string;
  potentialProblemSolved?: string;
  commercialConnection?: string;
  status: 'Captured' | 'Under Review' | 'Archived' | 'Promoted to Task';
}

export interface DailyReview {
  id: string;
  dateStr: string;
  completedAt: string;
  revenueEvidenceSummary: string;
  coreProgressSummary: string;
  explorationSummary: string;
  dominantState: string;
  startVibration: number;
  endVibration: number;
  recoveryNotes: string;
  learningRecorded: string;
  deviationNotes: string;
  evidenceOfCourage: string;
  tomorrowTop3: string[];
  tomorrowRevenueObjective: string;
}

export interface DayRecord {
  dateStr: string; // YYYY-MM-DD
  primaryDirection: string;
  revenueObjective: string;
  top3: Top3Item[];
  protectedFocusBlock: FocusBlock;
  currentActiveTask?: string;
  currentActiveTaskId?: string;
  checkIns: CheckIn[];
  revenueEvidences: RevenueEvidence[];
  ideas: IdeaItem[];
  review?: DailyReview;
  startingState?: StateMetrics;
  lastUpdated: string;
}

export interface NotificationSettings {
  enabled: boolean;
  checkInIntervalMinutes: number; // e.g. 60
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string; // "07:00"
  lastNotifiedAt?: string;
}

export interface UserSettings {
  primaryDirection: string;
  notifications: NotificationSettings;
  soundEnabled: boolean;
  theme: 'dark' | 'black';
}
