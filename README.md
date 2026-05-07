# Stellar Micro-Lending Protocol

A decentralized micro-credit infrastructure on the Stellar network enabling instant $5–$50 loans for unbanked users via mobile wallets, USDC stablecoins, and Soroban smart contracts.

Built for street vendors, freelancers, market traders, and mobile-money users across Africa, Southeast Asia, and Latin America.

---

## Why Stellar

| Property | Value |
|---|---|
| Transaction fee | ~$0.00001 |
| Finality | 3–5 seconds |
| Stablecoin | USDC (native on Stellar) |
| Mobile money | M-Pesa, MTN MoMo, OPay via Anchors |
| Standards | SEP-10, SEP-12, SEP-24, SEP-31, SEP-38 |

Micro-loans fail on most chains because gas fees exceed the loan value. On Stellar, a $7 loan repaid in $0.50 daily increments is economically viable.

---

## Architecture

```
Mobile App (React Native)
        │
        ▼
   API Gateway (NestJS)
        │
   ┌────┴────────────────┐
   │                     │
KYC / Credit Engine   Anchor Service
   │                     │
   └────────┬────────────┘
            │
     Soroban Contracts
            │
   ┌────────┴────────────┐
LendingPool  LoanManager  CreditScore  Treasury  Insurance
            │
     Stellar Blockchain
```

---

## Monorepo Structure

```
stellar-micro-lending-pp/
├── apps/
│   ├── mobile-app/          ← React Native (Expo) — this app
│   ├── web-dashboard/       ← Next.js lender dashboard (planned)
│   └── admin-panel/         ← Admin tooling (planned)
├── contracts/
│   ├── lending-pool/        ← Soroban: deposits, borrows, interest
│   ├── loan-manager/        ← Soroban: loan lifecycle
│   ├── reputation/          ← Soroban: on-chain credit score
│   ├── treasury/            ← Soroban: protocol revenue
│   └── insurance/           ← Soroban: default protection
├── backend/
│   ├── api-gateway/         ← NestJS REST API
│   ├── credit-engine/       ← AI underwriting
│   ├── fraud-engine/        ← Anti-sybil, device fingerprinting
│   ├── notification-service/
│   └── anchor-service/      ← Mobile money bridge
├── sdk/                     ← Shared Stellar/Soroban client
├── docs/
└── infrastructure/          ← Docker, Kubernetes, Terraform
```

---

## Mobile App (`apps/mobile-app`)

### Tech Stack

| Layer | Library |
|---|---|
| Framework | Expo (React Native) + TypeScript |
| Navigation | React Navigation v6 |
| State | Zustand |
| Data fetching | TanStack React Query |
| HTTP | Axios |
| Blockchain | `@stellar/stellar-sdk` |
| Testing | Jest + jest-expo |

### App Structure

```
src/
├── types/          # Shared TypeScript types (User, Loan, etc.)
├── services/       # API client — all backend endpoints
├── store/          # Zustand stores (auth, loans)
├── utils/          # Credit score helpers
├── navigation/     # RootNavigator (Auth stack + Main tabs)
├── components/     # Button, Card, CreditScoreBadge, LoanCard
├── screens/        # All app screens
└── __tests__/      # Unit tests
```

### Screens

| Screen | Route | Description |
|---|---|---|
| Welcome | Auth | Landing page |
| Register | Auth | Stellar address + phone + country → POST /users |
| KYC | Auth | SEP-12 identity verification |
| Dashboard | Main tab | Credit score, active loan, account summary |
| Loan Request | Main tab | Score-gated loan amount input → POST /loans |
| Loan History | Main tab | Full loan list |
| Repay | Main tab | Partial/full repayment → POST /loans/:id/repay |

### Credit Score → Loan Limits

| Score | Max Loan |
|---|---|
| 300–549 | $5 |
| 550–649 | $10 |
| 650–749 | $25 |
| 750–850 | $50 |

New users start at **500**. Repayments add **+20**. Defaults subtract **−80**.

---

## Getting Started

### Prerequisites

- Node.js 20+
- Expo CLI (`npm install -g expo-cli`)
- Backend API running (see `backend/api-gateway`)

### Install & Run

```bash
cd apps/mobile-app
npm install
npm start          # Expo dev server
```

Scan the QR code with [Expo Go](https://expo.dev/go) on your phone, or press `a` for Android emulator / `i` for iOS simulator.

### Environment

Create `apps/mobile-app/.env`:

```
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
```

---

## API Reference

Base URL: `http://localhost:3000/api/v1`  
Interactive docs: `http://localhost:3000/docs`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users` | Register user |
| GET | `/users/:id` | Get user + credit score |
| PATCH | `/users/:id/kyc` | Update KYC status |
| POST | `/loans` | Request a loan |
| GET | `/loans/:id` | Get loan details |
| POST | `/loans/:id/repay` | Submit repayment |
| PATCH | `/loans/:id/default` | Mark defaulted (admin) |

### Register a user

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"stellarAddress":"GABC...","phoneNumber":"+254700000000","country":"KE"}'
```

### Request a loan

```bash
curl -X POST http://localhost:3000/api/v1/loans \
  -H "Content-Type: application/json" \
  -d '{"borrowerId":"<userId>","amount":7,"dueDate":"2026-06-07T00:00:00.000Z"}'
```

---

## Stellar Network

### Testnet (development)

```
Horizon:    https://horizon-testnet.stellar.org
Soroban:    https://soroban-testnet.stellar.org
Passphrase: Test SDF Network ; September 2015
```

Fund a testnet wallet:

```bash
curl "https://friendbot.stellar.org?addr=YOUR_STELLAR_ADDRESS"
```

### Mainnet

```
Horizon:    https://horizon.stellar.org
Passphrase: Public Global Stellar Network ; September 2015
```

---

## Smart Contracts (Soroban / Rust)

| Contract | Responsibility |
|---|---|
| `LendingPool` | `deposit()`, `withdraw()`, `borrow()`, `repay()`, `calculate_interest()` |
| `LoanManager` | `create_loan()`, `mark_paid()`, `default_loan()`, `extend_loan()` |
| `CreditScore` | `get_score()`, `update_score()`, `reward_repayment()`, `penalize_default()` |
| `Treasury` | Protocol revenue, reserve fund |
| `Insurance` | Lender default protection (5–10% of fees) |

---

## Testing

```bash
cd apps/mobile-app
npm test              # Run all tests
npm run typecheck     # TypeScript check
```

Current coverage: **4 suites · 22 tests**

| Suite | Tests |
|---|---|
| `credit.test.ts` | Score limits, formatting, labels, colors |
| `authStore.test.ts` | setUser, updateUser, logout |
| `loansStore.test.ts` | setLoans, addLoan, updateLoan, activeLoan |
| `api.test.ts` | Mocked API calls, error handling |

---

## Loan Lifecycle

```
1. Register + KYC (SEP-12)
2. Credit score evaluated
3. User requests loan → LoanManager.create_loan()
4. USDC transferred to Stellar wallet
5. Anchor converts USDC → mobile money (M-Pesa, MTN MoMo, etc.)
6. User repays via mobile money or wallet
7. Credit score updated on-chain
```

---

## Roadmap

### Phase 1 — Current (40–50% complete)
- [x] React Native mobile app scaffold
- [x] Auth flow (register, KYC)
- [x] Loan request and repayment screens
- [x] Credit score system
- [x] Zustand state management
- [x] REST API service layer
- [x] Unit tests

### Phase 2
- [ ] Soroban contract deployment (testnet)
- [ ] SEP-10 wallet authentication
- [ ] Live Stellar SDK integration
- [ ] Backend API (NestJS + PostgreSQL)

### Phase 3
- [ ] Anchor / mobile money bridge (M-Pesa, MTN MoMo)
- [ ] AI credit underwriting engine
- [ ] Push notifications
- [ ] Web dashboard for lenders

### Phase 4
- [ ] Mainnet deployment
- [ ] Multi-country anchor support
- [ ] On-chain reputation marketplace
- [ ] Governance token (MLP)

---

## Revenue Model

| Source | Rate |
|---|---|
| Interest spread | Borrow 10%, lender earns 7%, protocol keeps 3% |
| Cash-out fee | 0.2–0.5% per withdrawal |
| Credit API | Reputation scoring sold to partners |

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit your changes
4. Open a pull request against `main`

---

## Links

- [Stellar Developer Docs](https://developers.stellar.org)
- [Soroban SDK (Rust)](https://docs.rs/soroban-sdk)
- [Stellar JS SDK](https://stellar.github.io/js-stellar-sdk/)
- [Freighter Wallet](https://www.freighter.app/)
- [Stellar Testnet Explorer](https://stellar.expert/explorer/testnet)
- [Friendbot (testnet faucet)](https://friendbot.stellar.org)
