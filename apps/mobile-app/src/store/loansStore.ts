import { create } from 'zustand';
import type { Loan } from '../types';

interface LoansState {
  loans: Loan[];
  activeLoan: Loan | null;
  setLoans: (loans: Loan[]) => void;
  addLoan: (loan: Loan) => void;
  updateLoan: (loanId: string, partial: Partial<Loan>) => void;
  setActiveLoan: (loan: Loan | null) => void;
}

export const useLoansStore = create<LoansState>((set) => ({
  loans: [],
  activeLoan: null,
  setLoans: (loans) => set({ loans }),
  addLoan: (loan) => set((s) => ({ loans: [loan, ...s.loans] })),
  updateLoan: (loanId, partial) =>
    set((s) => ({
      loans: s.loans.map((l) => (l.id === loanId ? { ...l, ...partial } : l)),
      activeLoan:
        s.activeLoan?.id === loanId
          ? { ...s.activeLoan, ...partial }
          : s.activeLoan,
    })),
  setActiveLoan: (loan) => set({ activeLoan: loan }),
}));
