# EcoDAO Complete Setup Guide

## Network Migration: Mumbai → Amoy

✅ **COMPLETED**: Updated all configurations to use Polygon Amoy testnet (Chain ID: 80002)

## Critical Steps to Deploy and Test Governance

### 1. Environment Setup

Create `.env` file in `/contracts` directory:
```bash
# Required for Amoy deployment
PRIVATE_KEY=your_private_key_here
AMOY_RPC=https://rpc-amoy.polygon.technology

# Optional: For contract verification
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

### 2. Get Amoy Test MATIC

1. Visit: https://faucet.polygon.technology/
2. Select "Polygon Amoy" network
3. Enter your wallet address
4. Request test MATIC tokens

### 3. Deploy Contracts to Amoy

```bash
cd contracts
npm run deploy:amoy
```

This will:
- Deploy all 5 contracts to Amoy testnet
- Update frontend addresses automatically
- Save deployment addresses to `deployed-addresses.json`

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local`:
```bash
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_from_cloud.walletconnect.com
NEXT_PUBLIC_CHAIN_ID=80002
```

Start frontend:
```bash
npm run dev
```

### 5. Test Governance Flow

#### Option A: Via Frontend (Recommended)
1. Open http://localhost:3000
2. Connect wallet to Amoy network
3. Submit environmental actions (photos required)
4. Wait for community verification
5. Earn tokens → delegate to self → create proposals

#### Option B: Via Scripts (For Testing)
```bash
# In contracts directory
npx hardhat run scripts/setup-governance.ts --network amoy
```

### 6. Governance Requirements

To create proposals, you need:
- **100 GREEN tokens** (earned through verified actions)
- **Delegated voting power** (delegate tokens to yourself)
- **Wait 1 day** after delegation for voting power to activate

### 7. Common Issues & Solutions

#### Problem: "GovernorInsufficientProposerVotes"
**Solution**: 
1. Submit more environmental actions
2. Get them verified by community
3. Delegate earned tokens to yourself
4. Wait for voting delay period

#### Problem: "Cannot connect to Amoy"
**Solution**:
1. Add Amoy network to MetaMask:
   - Network Name: Polygon Amoy
   - RPC URL: https://rpc-amoy.polygon.technology
   - Chain ID: 80002
   - Currency Symbol: MATIC
   - Block Explorer: https://amoy.polygonscan.com

#### Problem: "Insufficient funds"
**Solution**: Get test MATIC from faucet (step 2 above)

## Deployment Status

### Smart Contracts ✅
- All contracts compile successfully
- Tests pass (13/13)
- Ready for Amoy deployment

### Frontend ✅  
- Builds successfully with Turbopack
- Web3 integration configured for Amoy
- Contract addresses auto-update on deployment

### Configuration ✅
- Network settings updated to Amoy
- Package.json scripts configured
- Environment examples provided

## Next Actions

1. **Deploy to Amoy**: Follow steps 1-3 above
2. **Test proposal creation**: Use the governance interface
3. **Verify everything works**: Submit actions → earn tokens → create proposals

## Contact & Support

If you encounter issues:
1. Check the console logs in both frontend and terminal
2. Verify network configuration in wallet
3. Ensure sufficient test MATIC balance
4. Confirm environment variables are set correctly

---

**⚠️ Important**: Mumbai testnet has been deprecated. All operations now use Amoy testnet (Chain ID: 80002).