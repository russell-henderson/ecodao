# EcoDAO Technical Architecture

## System Overview

EcoDAO is a decentralized application (dApp) built on Polygon blockchain that enables community-driven environmental governance through token-based voting and action rewards. The architecture follows a modular, scalable design with clear separation between blockchain logic, application layer, and user interface.

## Architecture Diagram

```bash
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────┤
│  Web App (Next.js)          │  Mobile App (Future)         │
│  - React Components         │  - React Native             │
│  - Tailwind CSS             │  - Native UI Components     │
│  - State Management         │  - Offline Capabilities     │
└─────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────┐
│                 APPLICATION LAYER                           │
├─────────────────────────────────────────────────────────────┤
│  Web3 Integration Layer                                     │
│  - ethers.js / viem                                         │
│  - Wallet Connections (MetaMask, WalletConnect)             │
│  - Contract Interactions                                    │
│  - Transaction Management                                   │
└─────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────┐
│                 STORAGE LAYER                               │
├─────────────────────────────────────────────────────────────┤
│  IPFS Network               │  On-Chain Storage            │
│  - Action Photos            │  - Token Balances           │
│  - Proposal Documents       │  - Voting Records           │
│  - Project Updates          │  - Governance State         │
└─────────────────────────────────────────────────────────────┘
                               │
┌─────────────────────────────────────────────────────────────┐
│                 BLOCKCHAIN LAYER                            │
├─────────────────────────────────────────────────────────────┤
│               Polygon Network (Mumbai Testnet)             │
│                                                             │
│  Smart Contracts:                                           │
│  ├── GreenToken.sol (ERC-20 + ERC-20Votes)                │
│  ├── GreenGovernor.sol (OpenZeppelin Governor)             │
│  ├── ActionRewards.sol (Custom Reward Logic)               │
│  └── CommunityTreasury.sol (Fund Management)               │
└─────────────────────────────────────────────────────────────┘
```

## Smart Contract Architecture

### 1. GreenToken.sol

**Purpose**: ERC-20 governance token with voting capabilities

```solidity
contract GreenToken is ERC20, ERC20Permit, ERC20Votes {
    // Inherits OpenZeppelin's battle-tested implementations
    // Voting power based on token balance snapshots
    // Permit functionality for gasless approvals
}
```

**Key Features**:

- Standard ERC-20 functionality
- Snapshot-based voting power calculation
- Permit signatures for better UX
- Mintable only by ActionRewards contract

**Security Considerations**:

- Fixed supply cap to prevent inflation attacks
- Role-based access control for minting
- Pausable in emergency situations

### 2. GreenGovernor.sol

**Purpose**: Core governance logic for proposal voting

```solidity
contract GreenGovernor is Governor, GovernorSettings, GovernorCountingSimple, 
                         GovernorVotes, GovernorVotesQuorumFraction {
    // OpenZeppelin Governor with custom parameters
    // Proposals require minimum token threshold
    // Voting period: 7 days, Timelock: 2 days
}
```

**Governance Parameters**:

- **Voting Delay**: 1 day (allows snapshot creation)
- **Voting Period**: 7 days (sufficient for community participation)
- **Proposal Threshold**: 100 tokens (prevents spam)
- **Quorum**: 10% of total supply (ensures legitimacy)

### 3. ActionRewards.sol

**Purpose**: Custom logic for rewarding environmental actions

```solidity
contract ActionRewards is AccessControl, ReentrancyGuard {
    struct Action {
        address user;
        string ipfsHash;
        uint256 rewardAmount;
        ActionType actionType;
        bool verified;
        uint256 timestamp;
    }
    
    mapping(uint256 => Action) public actions;
    mapping(address => uint256) public userActionCount;
}
```

**Reward Mechanism**:

- Different action types have different reward amounts
- Community verification required before token minting
- Anti-spam measures with cooldown periods
- Reputation system for verifiers

### 4. CommunityTreasury.sol

**Purpose**: Automated fund management for approved projects

```solidity
contract CommunityTreasury is Ownable, ReentrancyGuard {
    struct Project {
        address proposer;
        uint256 fundingAmount;
        uint256 releasedAmount;
        bool completed;
        uint256[] milestones;
    }
    
    mapping(uint256 => Project) public projects;
}
```

**Features**:

- Milestone-based fund release
- Multi-signature requirements for large amounts
- Emergency pause functionality
- Transparent fund tracking

## Frontend Architecture

### Technology Stack

```typescript
// Core Framework
- Next.js 13+ (App Router)
- React 18+ (Server Components + Client Components)
- TypeScript (Type Safety)

// Styling
- Tailwind CSS (Utility-first styling)
- Headless UI (Accessible components)
- Lucide React (Icon system)

// Web3 Integration
- ethers.js or viem (Blockchain interactions)
- Wagmi (React hooks for Web3)
- RainbowKit (Wallet connection UI)

// State Management
- Zustand (Lightweight state management)
- React Query (Server state caching)

// Storage & APIs
- IPFS (Decentralized file storage)
- Pinata (IPFS pinning service)
```

### Component Architecture

```bash
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── LoadingSpinner.tsx
│   ├── web3/               # Web3-specific components
│   │   ├── WalletConnect.tsx
│   │   ├── TokenBalance.tsx
│   │   └── TransactionButton.tsx
│   ├── governance/         # Governance-related components
│   │   ├── ProposalList.tsx
│   │   ├── VotingInterface.tsx
│   │   └── CreateProposal.tsx
│   └── actions/            # Action-related components
│       ├── ActionSubmission.tsx
│       ├── ActionVerification.tsx
│       └── ActionHistory.tsx
├── hooks/                  # Custom React hooks
│   ├── useContract.ts
│   ├── useTokenBalance.ts
│   └── useGovernance.ts
├── lib/                    # Utility functions
│   ├── contracts.ts        # Contract ABIs and addresses
│   ├── ipfs.ts            # IPFS interaction utilities
│   └── utils.ts           # General utilities
└── pages/                  # Next.js pages
    ├── dashboard/
    ├── governance/
    ├── actions/
    └── profile/
```

### State Management Pattern

```typescript
// Global state with Zustand
interface AppState {
  // User state
  user: {
    address: string | null;
    tokenBalance: bigint;
    votingPower: bigint;
    actionCount: number;
  };
  
  // Governance state
  governance: {
    activeProposals: Proposal[];
    userVotes: Record<string, VoteChoice>;
  };
  
  // Actions
  connectWallet: () => Promise<void>;
  submitAction: (action: ActionData) => Promise<void>;
  vote: (proposalId: string, choice: VoteChoice) => Promise<void>;
}
```

## Data Flow Architecture

### 1. User Action Submission Flow

```bash
User Input → Frontend Validation → IPFS Upload → Smart Contract Call → 
Event Emission → State Update → UI Refresh
```

**Detailed Steps**:

1. User uploads photo and fills action form
2. Frontend validates input and compresses image
3. Image uploaded to IPFS, hash returned
4. Smart contract `submitAction()` called with IPFS hash
5. Event emitted for off-chain services to index
6. Frontend updates local state and shows pending status
7. Community verification process begins

### 2. Governance Proposal Flow

```
Proposal Creation → Voting Delay → Active Voting → Vote Counting → 
Execution → Fund Release
```

**Smart Contract Events**:

- `ProposalCreated(proposalId, proposer, description, startTime, endTime)`
- `VoteCast(voter, proposalId, support, weight)`
- `ProposalExecuted(proposalId)`

### 3. Token Reward Flow

```bash
Action Verification → Reward Calculation → Token Minting → 
Balance Update → Voting Power Recalculation
```

## Security Architecture

### Smart Contract Security

**Access Control**:

- Role-based permissions using OpenZeppelin's AccessControl
- Multi-signature requirements for critical operations
- Timelock delays for governance changes

**Reentrancy Protection**:

- ReentrancyGuard on all external calls
- Checks-Effects-Interactions pattern
- State updates before external calls

**Input Validation**:

- Comprehensive parameter validation
- Overflow/underflow protection with SafeMath
- String length limits to prevent gas attacks

### Frontend Security

**Web3 Security**:

- Signature verification for all transactions
- Contract address validation
- Transaction simulation before submission

**Data Validation**:

- Input sanitization on all user inputs
- IPFS hash validation
- File type and size restrictions

**Privacy Protection**:

- No sensitive data stored on-chain
- IPFS encryption for private documents
- Wallet address anonymization options

## Scalability Considerations

### Blockchain Scalability

**Layer 2 Solution**:

- Polygon network for fast, cheap transactions
- Ethereum mainnet bridge for maximum security
- Potential migration to other L2s if needed

**Gas Optimization**:

- Batch operations where possible
- Efficient data structures in contracts
- Proxy patterns for upgradeable contracts

### Application Scalability

**Frontend Performance**:

- Next.js static generation for fast loading
- Image optimization and lazy loading
- Component code splitting

**Data Management**:

- Efficient IPFS pinning strategies
- Local state caching with React Query
- Pagination for large data sets

### Database Architecture (Off-chain Indexing)

```bash
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Blockchain    │───▶│   Event Indexer │───▶│   PostgreSQL    │
│   Events        │    │   (Node.js)     │    │   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   GraphQL API   │
                       │   (Hasura)      │
                       └─────────────────┘
```

**Benefits**:

- Fast queries for complex data relationships
- Real-time subscriptions for live updates
- Caching layer for improved performance

## Deployment Architecture

### Development Environment

```yaml
# docker-compose.yml
version: '3.8'
services:
  hardhat:
    image: hardhat-node
    ports:
      - "8545:8545"
  
  ipfs:
    image: ipfs/go-ipfs
    ports:
      - "5001:5001"
      - "8080:8080"
  
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: verdao
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
```

### Production Deployment

**Smart Contracts**:

- Polygon Mumbai (testnet) → Polygon Mainnet
- Automated deployment with Hardhat scripts
- Contract verification on Polygonscan

**Frontend**:

- Vercel deployment with automatic HTTPS
- Environment-based configuration
- CDN distribution for global performance

**Infrastructure**:

- Pinata for reliable IPFS pinning
- Alchemy/Infura for RPC endpoints
- MongoDB Atlas for off-chain data

## Monitoring and Analytics

### On-chain Metrics

**Core KPIs**:

- Total tokens minted (community activity)
- Active voters per proposal (engagement)
- Project funding success rate (effectiveness)
- Average action verification time (system health)

**Technical Metrics**:

- Gas usage optimization
- Transaction failure rates
- Contract interaction patterns

### Off-chain Analytics

**User Experience**:

- Page load times and performance metrics
- User journey completion rates
- Feature usage statistics
- Error tracking and resolution

**Community Health**:

- New user onboarding success
- Community growth metrics
- Governance participation trends

## Future Architecture Considerations

### Mobile Application

**React Native Architecture**:

- Shared business logic with web app
- Native wallet integration
- Offline-first design with sync

### Multi-Community Support

**Architectural Changes**:

- Factory pattern for deploying community instances
- Shared infrastructure with isolated data
- Cross-community governance mechanisms

### Advanced Features

**Planned Integrations**:

- IoT sensor networks for automated verification
- AI-powered photo verification
- Carbon credit marketplace integration
- Municipal government APIs

---

This architecture document serves as the technical blueprint for EcoDAO, ensuring scalable, secure, and maintainable development while supporting the platform's community-driven environmental mission.
