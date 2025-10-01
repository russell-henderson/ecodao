# EcoDAO AI Coding Assistant Instructions

## Project Overview

EcoDAO is a blockchain-based environmental governance platform built on Polygon, using a **dual-workspace architecture**:
- `contracts/` - Hardhat project with Solidity smart contracts
- `frontend/` - Next.js 15 React app with Web3 integration

The core flow: Users submit environmental actions → Community verifies → Users earn governance tokens → Token holders vote on funding proposals.

## Critical Architecture Patterns

### Smart Contract Ecosystem
Four interconnected contracts form the governance core:
- **GreenToken**: ERC-20Votes token with snapshot-based voting power
- **ActionRewards**: Manages action submission, verification, and token minting 
- **GreenGovernor**: OpenZeppelin Governor with 7-day voting periods, 100 token proposal threshold
- **CommunityTreasury**: Automated funding distribution for approved proposals

**Key Pattern**: Only ActionRewards can mint tokens (MINTER_ROLE), ensuring rewards flow through verified actions.

### Web3 Integration Architecture
Frontend uses modern wagmi/viem stack with specific patterns:
- RainbowKit for wallet connections with fallback for missing WalletConnect Project ID
- Contract addresses auto-generated in `src/lib/addresses.generated.ts` by deployment script
- Network-specific contract addresses in `src/lib/contracts.ts` (Amoy testnet primary)
- TypeScript contract types auto-generated in `contracts/typechain-types/`

## Essential Development Workflows

### Smart Contract Development
```bash
# In contracts/ directory
npm run compile        # Compile contracts + generate TypeScript types
npm run test          # Run comprehensive test suite
npm run deploy:amoy   # Deploy to Polygon Amoy testnet
npm run gas-report    # Analyze gas usage patterns
```

**Critical**: After deployment, `scripts/deploy.ts` auto-updates frontend contract addresses via `update-frontend-addresses.js`.

### Frontend Development
```bash
# In frontend/ directory  
npm run dev           # Start with Turbopack for fast HMR
npm run build         # Production build with Turbopack
```

**Web3 Setup**: Configure `.env.local` with:
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` - Get from cloud.walletconnect.com
- `NEXT_PUBLIC_CHAIN_ID=80002` - Polygon Amoy testnet
- Contract addresses auto-populated by deployment script

### Testing Patterns
Smart contract tests follow comprehensive setup pattern in `test/EcoDAO.test.ts`:
- Deploy all contracts in beforeEach with proper role assignments
- Test complete user flows: action submission → verification → token earning → governance voting
- Use time manipulation for testing voting delays and periods

## Project-Specific Conventions

### Action Types & Verification
Actions use enum-based typing (COMPOSTING, CYCLING, etc.) with IPFS hash storage for photo verification. Verification follows community-based model with reputation-weighted verifiers.

### Governance Parameters
- **Voting Delay**: 1 day (allows snapshot creation)
- **Voting Period**: 7 days (community participation window)  
- **Proposal Threshold**: 100 tokens (spam prevention)
- **Quorum**: 10% of total supply

### State Management Patterns
Frontend uses React Query for blockchain state caching with automatic refetching on block changes. Contract interactions through custom hooks in `src/hooks/`.

## Cross-Component Communication

### Contract → Frontend Flow
1. Deployment script generates `addresses.generated.ts`
2. Frontend imports addresses from `contracts.ts`
3. ABI definitions co-located with addresses for type safety
4. Event listening for real-time UI updates

### Verification Workflow
Community verifiers review actions through ActionRewards contract. Treasury verifiers approve funding milestones. Both use reputation-weighted decision making.

### IPFS Integration
Action photos and proposal documents stored on IPFS via `ipfs-http-client`. Frontend handles pinning and retrieval for decentralized storage.

## Development Environment Notes

- **Hardhat Network**: Local development with chainId 1337
- **Amoy Testnet**: Primary deployment target (chainId 80002)  
- **Gas Optimization**: Contracts use OpenZeppelin's optimized implementations
- **TypeScript**: Strict typing throughout with auto-generated contract types
- **Turbopack**: Enabled for both dev and build for faster compilation

When working on governance features, remember the timelock delay affects proposal execution. Test with time manipulation in hardhat tests.