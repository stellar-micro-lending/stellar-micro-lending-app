import axios from 'axios';
import type { User, Loan, RegisterPayload, LoanRequestPayload, RepayPayload } from '../types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

export const api = axios.create({ baseURL: BASE_URL, timeout: 10_000 });

// Users
export const registerUser = (payload: RegisterPayload) =>
  api.post<User>('/users', payload).then((r) => r.data);

export const getUser = (userId: string) =>
  api.get<User>(`/users/${userId}`).then((r) => r.data);

export const updateKyc = (userId: string, kycStatus: string) =>
  api.patch<User>(`/users/${userId}/kyc`, { kycStatus }).then((r) => r.data);

// Loans
export const requestLoan = (payload: LoanRequestPayload) =>
  api.post<Loan>('/loans', payload).then((r) => r.data);

export const getLoan = (loanId: string) =>
  api.get<Loan>(`/loans/${loanId}`).then((r) => r.data);

export const repayLoan = (loanId: string, payload: RepayPayload) =>
  api.post<Loan>(`/loans/${loanId}/repay`, payload).then((r) => r.data);

export const defaultLoan = (loanId: string) =>
  api.patch<Loan>(`/loans/${loanId}/default`).then((r) => r.data);
