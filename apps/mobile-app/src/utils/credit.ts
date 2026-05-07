import { SCORE_LOAN_LIMITS } from '../types';

export function getMaxLoanAmount(creditScore: number): number {
  const tier = SCORE_LOAN_LIMITS.find(
    (t) => creditScore >= t.min && creditScore <= t.max
  );
  return tier?.limit ?? 0;
}

export function formatUSD(amount: number | string): string {
  return `$${Number(amount).toFixed(2)}`;
}

export function creditScoreLabel(score: number): string {
  if (score >= 750) return 'Excellent';
  if (score >= 650) return 'Good';
  if (score >= 550) return 'Fair';
  return 'Poor';
}

export function creditScoreColor(score: number): string {
  if (score >= 750) return '#22c55e';
  if (score >= 650) return '#84cc16';
  if (score >= 550) return '#f59e0b';
  return '#ef4444';
}
