import { useLoansStore } from '../store/loansStore';
import type { Loan } from '../types';

const loan1: Loan = {
  id: 'loan-1',
  borrowerId: 'user-1',
  amount: '7',
  interestRate: '10.00',
  dueDate: '2026-06-07T00:00:00.000Z',
  status: 'active',
};

const loan2: Loan = { ...loan1, id: 'loan-2', status: 'repaid' };

beforeEach(() => {
  useLoansStore.setState({ loans: [], activeLoan: null });
});

describe('loansStore', () => {
  it('sets loans array', () => {
    useLoansStore.getState().setLoans([loan1, loan2]);
    expect(useLoansStore.getState().loans).toHaveLength(2);
  });

  it('prepends new loan', () => {
    useLoansStore.getState().setLoans([loan2]);
    useLoansStore.getState().addLoan(loan1);
    expect(useLoansStore.getState().loans[0].id).toBe('loan-1');
  });

  it('updates loan by id', () => {
    useLoansStore.getState().setLoans([loan1]);
    useLoansStore.getState().updateLoan('loan-1', { status: 'repaid' });
    expect(useLoansStore.getState().loans[0].status).toBe('repaid');
  });

  it('updates activeLoan when id matches', () => {
    useLoansStore.getState().setLoans([loan1]);
    useLoansStore.getState().setActiveLoan(loan1);
    useLoansStore.getState().updateLoan('loan-1', { status: 'repaid' });
    expect(useLoansStore.getState().activeLoan?.status).toBe('repaid');
  });

  it('sets and clears activeLoan', () => {
    useLoansStore.getState().setActiveLoan(loan1);
    expect(useLoansStore.getState().activeLoan?.id).toBe('loan-1');
    useLoansStore.getState().setActiveLoan(null);
    expect(useLoansStore.getState().activeLoan).toBeNull();
  });
});
