import { useAuthStore } from '../store/authStore';
import type { User } from '../types';

const mockUser: User = {
  id: 'user-1',
  stellarAddress: 'GABC123',
  phoneNumber: '+254700000000',
  country: 'KE',
  creditScore: 500,
  kycStatus: 'pending',
  createdAt: '2026-05-07T00:00:00.000Z',
};

beforeEach(() => {
  useAuthStore.setState({ user: null, isAuthenticated: false });
});

describe('authStore', () => {
  it('sets user and marks authenticated', () => {
    useAuthStore.getState().setUser(mockUser);
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it('updates partial user fields', () => {
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().updateUser({ creditScore: 600, kycStatus: 'approved' });
    const { user } = useAuthStore.getState();
    expect(user?.creditScore).toBe(600);
    expect(user?.kycStatus).toBe('approved');
    expect(user?.stellarAddress).toBe('GABC123');
  });

  it('logs out and clears state', () => {
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('updateUser is a no-op when user is null', () => {
    useAuthStore.getState().updateUser({ creditScore: 700 });
    expect(useAuthStore.getState().user).toBeNull();
  });
});
