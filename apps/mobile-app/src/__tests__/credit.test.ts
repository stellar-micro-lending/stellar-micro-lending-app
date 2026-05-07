import {
  getMaxLoanAmount,
  formatUSD,
  creditScoreLabel,
  creditScoreColor,
} from '../utils/credit';

describe('getMaxLoanAmount', () => {
  it('returns 5 for score 300–549', () => {
    expect(getMaxLoanAmount(300)).toBe(5);
    expect(getMaxLoanAmount(500)).toBe(5);
    expect(getMaxLoanAmount(549)).toBe(5);
  });
  it('returns 10 for score 550–649', () => {
    expect(getMaxLoanAmount(550)).toBe(10);
    expect(getMaxLoanAmount(600)).toBe(10);
  });
  it('returns 25 for score 650–749', () => {
    expect(getMaxLoanAmount(700)).toBe(25);
  });
  it('returns 50 for score 750–850', () => {
    expect(getMaxLoanAmount(800)).toBe(50);
    expect(getMaxLoanAmount(850)).toBe(50);
  });
  it('returns 0 for out-of-range score', () => {
    expect(getMaxLoanAmount(100)).toBe(0);
    expect(getMaxLoanAmount(900)).toBe(0);
  });
});

describe('formatUSD', () => {
  it('formats numbers to dollar string', () => {
    expect(formatUSD(7)).toBe('$7.00');
    expect(formatUSD(7.7)).toBe('$7.70');
    expect(formatUSD('10')).toBe('$10.00');
  });
});

describe('creditScoreLabel', () => {
  it('returns correct labels', () => {
    expect(creditScoreLabel(800)).toBe('Excellent');
    expect(creditScoreLabel(700)).toBe('Good');
    expect(creditScoreLabel(600)).toBe('Fair');
    expect(creditScoreLabel(400)).toBe('Poor');
  });
});

describe('creditScoreColor', () => {
  it('returns green for excellent', () => {
    expect(creditScoreColor(800)).toBe('#22c55e');
  });
  it('returns red for poor', () => {
    expect(creditScoreColor(400)).toBe('#ef4444');
  });
});
