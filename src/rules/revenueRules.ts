/**
 * HORaiser — Revenue Rules Engine
 * Pure rules for evaluating revenue actions, evidence lanes, and commercial validity.
 */

import { RevenueEvidence, RevenueType } from '../types';

export const REVENUE_LANE_DESCRIPTIONS = {
  Pipeline: 'Creating opportunities (Prospect research, outreach sent, follow-ups, lead gen, networking)',
  Conversion: 'Moving opportunities to business (Sales call, discovery, proposal sent, closing, negotiating)',
  'Delivery / Asset': 'Delivering value or sellable asset (Client work, productized service, reusable automation, portfolio proof)',
};

export function isValidRevenueAction(type: RevenueType, details: string): boolean {
  if (type === 'Not Revenue') return false;
  if (!details || details.trim().length < 5) return false;
  return true;
}

export function evaluateDailyRevenueStatus(evidences: RevenueEvidence[]): {
  hasRevenueAction: boolean;
  pipelineCount: number;
  conversionCount: number;
  deliveryCount: number;
  totalScore: number;
  message: string;
} {
  const pipelineCount = evidences.filter((e) => e.lane === 'Pipeline').length;
  const conversionCount = evidences.filter((e) => e.lane === 'Conversion').length;
  const deliveryCount = evidences.filter((e) => e.lane === 'Delivery / Asset').length;
  const hasRevenueAction = evidences.length > 0;

  let totalScore = 0;
  evidences.forEach((e) => {
    totalScore += e.commercialValueScore || 5;
  });

  let message = 'No revenue action recorded yet today. Remember: Every working day requires a revenue action!';
  if (hasRevenueAction) {
    message = `Revenue Evidence Logged: ${evidences.length} action(s) across ${
      [pipelineCount && 'Pipeline', conversionCount && 'Conversion', deliveryCount && 'Delivery'].filter(Boolean).join(', ')
    }.`;
  }

  return {
    hasRevenueAction,
    pipelineCount,
    conversionCount,
    deliveryCount,
    totalScore,
    message,
  };
}
