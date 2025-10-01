import hre from "hardhat";
import "@nomicfoundation/hardhat-toolbox";

async function main() {
  console.log("🔍 Checking contract deployment...\n");

  // Read deployed addresses
  const fs = require('fs');
  const path = require('path');
  
  const addressesPath = path.join(__dirname, '../deployed-addresses.json');
  const addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
  
  console.log("📄 Using deployed contracts:", addresses);
  
  try {
    // Check GreenToken
    const greenToken = await hre.ethers.getContractAt("GreenToken", addresses.GreenToken);
    const tokenName = await greenToken.name();
    const tokenSymbol = await greenToken.symbol();
    const totalSupply = await greenToken.totalSupply();
    console.log("🪙 GreenToken:");
    console.log("  Name:", tokenName);
    console.log("  Symbol:", tokenSymbol);
    console.log("  Total Supply:", totalSupply.toString());
    
    // Check ActionRewards - try basic functions first
    const actionRewards = await hre.ethers.getContractAt("ActionRewards", addresses.ActionRewards);
    
    // Try to get total actions count
    const totalActions = await actionRewards.getTotalActions();
    console.log("🎯 ActionRewards:");
    console.log("  Total Actions:", totalActions.toString());
    
    // Check if it has the minter role on the token
    const MINTER_ROLE = await greenToken.MINTER_ROLE();
    const hasMinterRole = await greenToken.hasRole(MINTER_ROLE, addresses.ActionRewards);
    console.log("  Has Minter Role:", hasMinterRole);
    
    // Check Governor
    const governor = await hre.ethers.getContractAt("GreenGovernor", addresses.GreenGovernor);
    const govName = await governor.name();
    const proposalThreshold = await governor.proposalThreshold();
    console.log("🏛️  GreenGovernor:");
    console.log("  Name:", govName);
    console.log("  Proposal Threshold:", proposalThreshold.toString());
    
    console.log("✅ All contracts deployed and accessible!");
    
  } catch (error) {
    console.error("❌ Error checking contracts:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });