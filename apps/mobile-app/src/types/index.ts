export type KycStatus = 'pending' | 'approved' | 'rejected';
export type LoanStatus = 'active' | 'repaid' | 'defaulted';

export interface User {
  id: string;
  stellarAddress: string;
  phoneNumber: string;
  country: string;
  creditScore: number;
  kycStatus: KycStatus;
  createdAt: string;
}

export interface Loan {
  id: string;
  borrowerId: string;
  amount: string;
  interestRate: string;
  dueDate: string;
  status: LoanStatus;
  createdAt?: string;
}

export interface Repayment {
  repaymentId: string;
  loanId: string;
  amount: number;
  txHash: string;
}

export interface RegisterPayload {
  stellarAddress: string;
  phoneNumber: string;
  country: string;
}

export interface LoanRequestPayload {
  borrowerId: string;
  amount: number;
  dueDate: string;
}

export interface RepayPayload {
  payerId: string;
  amount: number;
}

/** Credit score → max loan amount mapping */
export const SCORE_LOAN_LIMITS: { min: number; max: number; limit: number }[] = [
  { min: 300, max: 549, limit: 5 },
  { min: 550, max: 649, limit: 10 },
  { min: 650, max: 749, limit: 25 },
  { min: 750, max: 850, limit: 50 },
];
