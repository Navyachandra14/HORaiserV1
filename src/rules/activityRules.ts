/**
 * HORaiser — Activity Rules Engine
 * Classification of activities, alignment verification, and parallel productive work rules.
 */

import { ActivityCategory } from '../types';

export const ALL_ACTIVITY_CATEGORIES: { name: ActivityCategory; description: string; isCore: boolean }[] = [
  { name: 'Revenue', description: 'Direct prospect research, outreach, sales conversations, proposals, closing', isCore: true },
  { name: 'Core Work', description: 'Deep execution on primary objectives and planned outcomes', isCore: true },
  { name: 'Client Delivery', description: 'Fulfilling paid promises, audits, reports, and client assets', isCore: true },
  { name: 'Build', description: 'Creating software, automation, systems, or sellable tools', isCore: true },
  { name: 'Communication', description: 'Publishing useful content, videos, outreach replies, networking', isCore: true },
  { name: 'Learning', description: 'Acquiring specific capability needed for active tasks', isCore: false },
  { name: 'Exploration', description: 'Testing tools/ideas with declared purpose & time boundary', isCore: false },
  { name: 'Parallel Productive Work', description: 'Active focus while long background jobs run', isCore: false },
  { name: 'Foundation', description: 'Exercise, meditation, nutrition, sleep prep, spiritual practice', isCore: false },
  { name: 'Recovery', description: 'Deliberate rest, walk, reset after high intensity', isCore: false },
  { name: 'Administration', description: 'Emails, scheduling, taxes, basic maintenance', isCore: false },
  { name: 'Unplanned', description: 'Mandatory unexpected tasks or urgent requests', isCore: false },
  { name: 'Drift', description: 'Unintentional distraction or low-value tab hopping', isCore: false },
];

export function isAlignedCategory(category: ActivityCategory): boolean {
  return ['Revenue', 'Core Work', 'Client Delivery', 'Build', 'Communication', 'Foundation', 'Parallel Productive Work'].includes(category);
}
