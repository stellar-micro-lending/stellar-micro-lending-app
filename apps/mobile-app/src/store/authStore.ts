import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  updateUser: (partial: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  updateUser: (partial) =>
    set((s) => ({ user: s.user ? { ...s.user, ...partial } : s.user })),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
