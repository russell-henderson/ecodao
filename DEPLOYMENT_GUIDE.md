# EcoDAO Deployment Guide

## Prerequisites for Deployment

Before deploying the contracts, you need:

1. **A wallet with test POL on Polygon Amoy testnet**
   - Get test POL from: <https://faucet.polygon.technology/>
   - Make sure to select "Amoy" network

2. **Set up environment variables**
   - Copy `contracts/env.example` to `contracts/.env`
   - Add your private key: `AMOY_PRIVATE_KEY=0x<your_private_key>`

## Deployment Commands

### 1. Compile Contracts

```bash
cd contracts
npx hardhat compile
```

### 2. Deploy to Amoy Testnet

```bash
npx hardhat run scripts/deploy.ts --network amoy
```

This will:

- Deploy all contracts (GreenToken, GreenGovernor, ActionRewards, CommunityTreasury)
- Set up initial verifiers
- Fund the treasury with 1M EcoTokens
- Save contract addresses to `deployed-addresses.json`

### 3. Update Frontend Configuration

After deployment, update the frontend contract addresses:

1. Copy addresses from `contracts/deployed-addresses.json`
2. Update `frontend/src/lib/contracts.ts` with the deployed addresses
3. Or set environment variables in `frontend/.env.local`:

   ```
   NEXT_PUBLIC_GREEN_TOKEN_ADDRESS=<deployed_address>
   NEXT_PUBLIC_GREEN_GOVERNOR_ADDRESS=<deployed_address>
   NEXT_PUBLIC_ACTION_REWARDS_ADDRESS=<deployed_address>
   NEXT_PUBLIC_COMMUNITY_TREASURY_ADDRESS=<deployed_address>
   ```

## Demo Flow

Once deployed, you can follow the demo flow from the RUNBOOK.md:

1. Connect wallet to Amoy testnet
2. Submit eco-actions to earn tokens
3. Delegate votes
4. Create governance proposals
5. Vote on proposals
6. Execute successful proposals

## Troubleshooting

- **Gas errors**: Ensure wallet has sufficient test POL
- **Network errors**: Verify you're connected to Amoy testnet (Chain ID: 80002)
- **Contract errors**: Check that all contracts deployed successfully
