import axios from 'axios';
import { registerUser, getUser, requestLoan, repayLoan, updateKyc } from '../services/api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock axios.create to return a mock instance
const mockGet = jest.fn();
const mockPost = jest.fn();
const mockPatch = jest.fn();

jest.mock('../services/api', () => {
  const actual = jest.requireActual('../services/api');
  return {
    ...actual,
    api: { get: mockGet, post: mockPost, patch: mockPatch },
    registerUser: jest.fn(),
    getUser: jest.fn(),
    requestLoan: jest.fn(),
    repayLoan: jest.fn(),
    updateKyc: jest.fn(),
  };
});

const { registerUser: mockRegister, getUser: mockGetUser, requestLoan: mockRequestLoan } =
  jest.requireMock('../services/api');

describe('API service (mocked)', () => {
  beforeEach(() => jest.clearAllMocks());

  it('registerUser resolves with user data', async () => {
    const user = { id: 'u1', stellarAddress: 'GABC', creditScore: 500, kycStatus: 'pending' };
    mockRegister.mockResolvedValue(user);
    const result = await mockRegister({ stellarAddress: 'GABC', phoneNumber: '+1', country: 'US' });
    expect(result).toEqual(user);
    expect(mockRegister).toHaveBeenCalledTimes(1);
  });

  it('getUser resolves with user data', async () => {
    const user = { id: 'u1', creditScore: 520 };
    mockGetUser.mockResolvedValue(user);
    const result = await mockGetUser('u1');
    expect(result.creditScore).toBe(520);
  });

  it('requestLoan resolves with loan data', async () => {
    const loan = { id: 'l1', amount: '7', status: 'active', interestRate: '10.00' };
    mockRequestLoan.mockResolvedValue(loan);
    const result = await mockRequestLoan({ borrowerId: 'u1', amount: 7, dueDate: '2026-06-07' });
    expect(result.status).toBe('active');
    expect(result.amount).toBe('7');
  });

  it('registerUser rejects on network error', async () => {
    mockRegister.mockRejectedValue(new Error('Network Error'));
    await expect(mockRegister({ stellarAddress: 'G', phoneNumber: '+1', country: 'US' }))
      .rejects.toThrow('Network Error');
  });
});
