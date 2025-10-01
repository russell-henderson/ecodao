# 🎉 EcoDAO Local Testing Guide

## ✅ **Success! Contracts Deployed Locally**

Your EcoDAO governance system is now fully deployed and ready for testing!

### 📋 **Deployed Contract Addresses** (Local Hardhat Network)
- **GreenToken**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **ActionRewards**: `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`  
- **TimelockController**: `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9`
- **GreenGovernor**: `0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9`
- **CommunityTreasury**: `0x5FC8d32690cc91D4c39d9d3abcBD16989F875707`

## 🚀 **How to Test Governance (3 Options)**

### **Option 1: Frontend Testing (Recommended)**

#### **Step 1: Start Frontend**
```bash
cd frontend
npm run dev
```

#### **Step 2: Configure MetaMask for Local Network**
1. Open MetaMask
2. Add Custom Network:
   - **Network Name**: `Hardhat Local`
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `1337`
   - **Currency Symbol**: `ETH`

#### **Step 3: Import Test Account**
Import any of these test accounts (they have 10,000 ETH each):

**Account #0** (Deployer):
- Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

**Account #1** (User):
- Address: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- Private Key: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`

#### **Step 4: Test the Complete Flow**
1. **Submit Actions**: Create environmental actions
2. **Verify Actions**: Get community verification
3. **Earn Tokens**: Receive GREEN tokens for verified actions
4. **Delegate Power**: Delegate tokens to yourself for voting
5. **Create Proposals**: Submit governance proposals
6. **Vote**: Participate in governance decisions

---

### **Option 2: Hardhat Console Testing**

```bash
cd contracts
npx hardhat console --network hardhat
```

**Test Commands:**
```javascript
// Get contracts
const greenToken = await ethers.getContractAt("GreenToken", "0x5FbDB2315678afecb367f032d93F642f64180aa3");
const actionRewards = await ethers.getContractAt("ActionRewards", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
const governor = await ethers.getContractAt("GreenGovernor", "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9");

// Check deployer balance
const [deployer] = await ethers.getSigners();
console.log("Deployer:", deployer.address);
console.log("Token Balance:", await greenToken.balanceOf(deployer.address));

// Submit and verify an action to earn tokens
await actionRewards.submitAction(0, "test-ipfs-hash");
await actionRewards.verifyAction(0, true, "Test verification");

// Check new balance
console.log("New Balance:", await greenToken.balanceOf(deployer.address));

// Delegate for voting power
await greenToken.delegate(deployer.address);

// Check voting power
console.log("Voting Power:", await greenToken.getVotes(deployer.address));

// Create a test proposal
const targets = ["0x0000000000000000000000000000000000000000"];
const values = [0];
const calldatas = ["0x"];
const description = "Test Proposal: This is a test governance proposal";

const tx = await governor.propose(targets, values, calldatas, description);
const receipt = await tx.wait();
console.log("Proposal created! Check transaction:", receipt.hash);
```

---

### **Option 3: Test Script**

```bash
cd contracts
npx hardhat test
```

This runs the complete test suite covering all governance functionality.

---

## 🎯 **What You Can Test**

### **✅ Environmental Actions System**
- Submit different action types (COMPOSTING, CYCLING, etc.)
- Photo verification via IPFS
- Community-based verification process
- Token rewards for verified actions

### **✅ Governance System**  
- Token delegation and voting power
- Proposal creation (requires 100 tokens)
- Voting on proposals (7-day period)
- Timelock execution for approved proposals

### **✅ Treasury Management**
- Funding distribution for approved projects
- Multi-signature verification requirements
- Automated milestone-based payments

## 🔧 **Troubleshooting**

### **Problem: "Wrong Network" in Frontend**
**Solution**: Make sure MetaMask is connected to Hardhat Local (Chain ID: 1337)

### **Problem: "Insufficient Funds" for Proposals**
**Solution**: Submit and verify more actions to earn 100+ GREEN tokens

### **Problem: "No Voting Power"**
**Solution**: Delegate your tokens to yourself: `greenToken.delegate(yourAddress)`

### **Problem: Contracts Not Found**
**Solution**: Redeploy if needed: `npx hardhat run scripts/deploy.ts --network hardhat`

---

## 🌟 **Advantages of Local Testing**

- ✅ **Unlimited ETH** - No faucet limitations
- ✅ **Instant transactions** - No waiting for block confirmations  
- ✅ **Fast testing** - Rapid iteration and debugging
- ✅ **Full control** - Manipulate time, balances, etc.
- ✅ **Privacy** - No public blockchain exposure

## 🚀 **Next Steps**

1. **Test locally** until you're satisfied with functionality
2. **When ready for public testnet**, get more Amoy tokens or try:
   - Different faucets
   - Community Discord channels
   - Testnet token exchanges
3. **Deploy to mainnet** when governance is proven

---

**🎯 Your governance platform is fully functional and ready for comprehensive testing!**