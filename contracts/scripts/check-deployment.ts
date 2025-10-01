// Check deployment requirements and status
import { ethers } from "hardhat";

async function main() {
  console.log("🔍 Checking EcoDAO deployment requirements...\n");

  try {
    // Try to get signers
    const signers = await ethers.getSigners();
    if (signers.length === 0) {
      console.log("❌ No signers found. Please check your private key configuration.");
      console.log("   Add AMOY_PRIVATE_KEY to your .env file (without 0x prefix)");
      return;
    }

    const deployer = signers[0];
    console.log("✅ Deployer account:", deployer.address);

    // Check balance
    const balance = await ethers.provider.getBalance(deployer.address);
    const balanceEth = ethers.formatEther(balance);
    console.log("💰 Account balance:", balanceEth, "MATIC");

    if (parseFloat(balanceEth) < 0.1) {
      console.log("⚠️  Low balance! You may need more MATIC for deployment.");
      console.log("   Get testnet MATIC from: https://faucet.polygon.technology/");
    } else {
      console.log("✅ Sufficient balance for deployment");
    }

    // Check network
    const network = await ethers.provider.getNetwork();
    console.log("🌐 Connected to network:");
    console.log("   Name:", network.name);
    console.log("   Chain ID:", network.chainId.toString());
    
    if (network.chainId === 80002n) {
      console.log("✅ Connected to Polygon Amoy testnet");
    } else if (network.chainId === 1337n) {
      console.log("✅ Connected to local Hardhat network");
    } else {
      console.log("⚠️  Unexpected network. Expected Amoy (80002) or Hardhat (1337)");
    }

    // Check if contracts are already deployed
    console.log("\n📋 Checking for existing contract deployments...");
    
    // Try to read the deployed addresses file
    const fs = require('fs');
    const path = require('path');
    
    try {
      const addressesPath = path.join(__dirname, '../deployed-addresses.json');
      if (fs.existsSync(addressesPath)) {
        const addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
        console.log("📄 Found deployed-addresses.json:");
        console.log("   GreenToken:", addresses.GreenToken);
        console.log("   GreenGovernor:", addresses.GreenGovernor);
        console.log("   ActionRewards:", addresses.ActionRewards);
        console.log("   CommunityTreasury:", addresses.CommunityTreasury);
        
        // Check if these contracts exist on-chain
        const greenTokenCode = await ethers.provider.getCode(addresses.GreenToken);
        if (greenTokenCode !== '0x') {
          console.log("✅ Contracts appear to be deployed and active");
        } else {
          console.log("⚠️  Contract addresses found but contracts not deployed to current network");
        }
      } else {
        console.log("📄 No deployed-addresses.json found - contracts need to be deployed");
      }
    } catch (error) {
      console.log("📄 No existing deployment found");
    }

    console.log("\n🚀 Deployment Status Summary:");
    console.log("="* 50);
    
    if (parseFloat(balanceEth) >= 0.1 && network.chainId === 80002n) {
      console.log("✅ Ready for deployment to Amoy testnet");
      console.log("   Run: npm run deploy:amoy");
    } else if (network.chainId === 1337n) {
      console.log("✅ Ready for local deployment");
      console.log("   Run: npm run deploy:local");
    } else {
      console.log("❌ Not ready for deployment");
      console.log("   - Check private key configuration");
      console.log("   - Ensure sufficient MATIC balance");
      console.log("   - Verify network configuration");
    }

  } catch (error) {
    console.error("❌ Error checking deployment requirements:", error.message);
    console.log("\n🔧 Troubleshooting steps:");
    console.log("1. Ensure .env file exists with AMOY_PRIVATE_KEY");
    console.log("2. Check hardhat.config.ts network configuration");
    console.log("3. Verify network connectivity");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Check failed:", error);
    process.exit(1);
  });