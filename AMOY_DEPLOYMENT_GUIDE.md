# Polygon Amoy Testnet Deployment Guide

This guide will help you deploy and test the EcoDAO smart contracts on Polygon Amoy testnet and resolve proposal creation issues.

## 🔧 Prerequisites

### 1. **Get Amoy Testnet MATIC**
- Visit [Polygon Faucet](https://faucet.polygon.technology/)
- Select "Polygon Amoy Testnet"
- Enter your wallet address
- Request testnet MATIC (you'll need some for deployment and testing)

### 2. **Environment Setup**

Create `.env` file in the `contracts/` directory:

```bash
# contracts/.env
AMOY_PRIVATE_KEY=your_private_key_without_0x_prefix
AMOY_RPC=https://rpc-amoy.polygon.technology
POLYGONSCAN_API_KEY=your_polygonscan_api_key_optional
```

Create `.env.local` file in the `frontend/` directory:

```bash
# frontend/.env.local
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

## 🚀 Deployment Steps

### 1. **Deploy Smart Contracts**

```bash
cd contracts

# Compile contracts
npm run compile

# Run tests to ensure everything works
npm test

# Deploy to Amoy testnet
npm run deploy:amoy
```

**Expected Output:**
```
🚀 Starting EcoDAO contract deployment...
Deploying contracts with account: 0x...
✅ GreenToken deployed to: 0x...
✅ ActionRewards deployed to: 0x...
✅ TimelockController deployed to: 0x...
✅ GreenGovernor deployed to: 0x...
✅ CommunityTreasury deployed to: 0x...
📄 Frontend addresses written to src/lib/addresses.generated.ts
```

### 2. **Verify Deployment**

The deployment script automatically:
- ✅ Updates frontend contract addresses
- ✅ Sets up proper role permissions
- ✅ Funds the treasury with initial tokens
- ✅ Configures verifiers for action verification

### 3. **Start Frontend**

```bash
cd frontend

# Install dependencies if not done
npm install

# Start development server
npm run dev
```

Visit: http://localhost:3000

## 🗳️ Creating Proposals - Step by Step

### **Issue**: Cannot Create Proposals

**Common causes and solutions:**

### 1. **Insufficient Voting Power**
- **Requirement**: 100 EcoTokens minimum for proposal creation
- **Solution**: Earn tokens through verified environmental actions

**Steps to get voting power:**
```bash
# Check your current token balance in the frontend dashboard
# Submit environmental actions with photo verification
# Wait for community verification
# Delegate tokens to yourself for voting power
```

### 2. **Missing Token Delegation**
Even if you have tokens, you need to delegate them to yourself for voting power.

**In the frontend:**
1. Go to Dashboard
2. Find "Delegate Voting Power" section
3. Click "Delegate to Self" 
4. Confirm transaction

### 3. **Network Configuration Issues**
Ensure you're connected to Polygon Amoy testnet (Chain ID: 80002)

**MetaMask Network Settings:**
- **Network Name**: Polygon Amoy Testnet
- **RPC URL**: https://rpc-amoy.polygon.technology
- **Chain ID**: 80002
- **Currency Symbol**: MATIC
- **Block Explorer**: https://amoy.polygonscan.com

### 4. **Using Governance Helper Functions**

You can use the pre-built proposal templates:

```typescript
import { EXAMPLE_PROPOSALS } from '@/lib/governanceActions';

// Create a test proposal
const testProposal = EXAMPLE_PROPOSALS.testProposal();

// Create a funding proposal
const gardenProposal = EXAMPLE_PROPOSALS.communityGarden();
```

## 🧪 Testing the Full Flow

### **Complete Test Scenario:**

1. **Connect Wallet** (Polygon Amoy testnet)
2. **Submit Environmental Action**
   - Take photo of environmental activity
   - Submit action with IPFS photo hash
   - Wait for verification

3. **Earn Tokens & Delegate**
   - Receive EcoTokens after verification
   - Delegate tokens to yourself for voting power

4. **Create Proposal**
   - Use test proposal template
   - Submit with sufficient voting power

5. **Vote on Proposal**
   - Cast vote during voting period
   - Check proposal status

## 🔍 Troubleshooting

### **Contract Interaction Issues**

```bash
# Check contract deployment
cd contracts
npx hardhat console --network amoy

# In the console:
const GreenGovernor = await ethers.getContractFactory("GreenGovernor");
const governor = await GreenGovernor.attach("DEPLOYED_ADDRESS");
await governor.proposalThreshold(); // Should return 100000000000000000000 (100 tokens)
```

### **Frontend Issues**

```bash
# Check if contracts are properly connected
cd frontend
npm run build

# Should build without errors about missing contract addresses
```

### **Common Error Solutions**

1. **"Transaction Reverted"**
   - Check if you have enough MATIC for gas
   - Verify you have required token balance
   - Ensure you're on the correct network

2. **"Cannot Connect to Network"**
   - Verify RPC URL in environment variables
   - Check if Amoy testnet is responsive
   - Try alternative RPC: `https://polygon-amoy.g.alchemy.com/v2/demo`

3. **"Proposal Creation Failed"**
   - Check voting power: must have ≥100 tokens
   - Verify token delegation to self
   - Confirm governance parameters

## 📊 Quick Verification Commands

```bash
# Check governance parameters
cd contracts
npx hardhat run scripts/check-governance.js --network amoy

# Check token balances
npx hardhat run scripts/check-balances.js --network amoy

# Verify contract deployment
npx hardhat verify --network amoy DEPLOYED_ADDRESS
```

## 🎯 Success Checklist

- [ ] ✅ Smart contracts deployed to Amoy testnet
- [ ] ✅ Frontend connects to correct network (80002)
- [ ] ✅ Contract addresses auto-updated in frontend
- [ ] ✅ Can submit environmental actions
- [ ] ✅ Actions get verified and reward tokens
- [ ] ✅ Tokens are delegated for voting power
- [ ] ✅ Can create proposals with sufficient tokens
- [ ] ✅ Can vote on active proposals

## 🆘 Need Help?

If you encounter issues:

1. **Check the console** for error messages
2. **Verify network configuration** (Chain ID: 80002)
3. **Confirm token balance and delegation**
4. **Test with small amounts first**

**Common Test Addresses for Proposals:**
- Test Recipient: `0x742d35Cc6634C0532925a3b8D404E76E0DC74E3B`
- Zero Address (no-op): `0x0000000000000000000000000000000000000000`

The key is having enough EcoTokens (≥100) and proper delegation to create proposals!