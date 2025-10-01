import hre from "hardhat";
import "@nomicfoundation/hardhat-toolbox";

async function main() {
  console.log("🔧 Setting governance integration (force)...\n");

  // Read deployed addresses
  const fs = require('fs');
  const path = require('path');
  
  const addressesPath = path.join(__dirname, '../deployed-addresses.json');
  const addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
  
  console.log("📄 Using deployed contracts:", addresses);
  
  // Get signer
  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);

  try {
    // Connect to ActionRewards contract
    const actionRewards = await hre.ethers.getContractAt("ActionRewards", addresses.ActionRewards);
    
    console.log("⚡ Setting governor address...");
    const tx = await actionRewards.setGovernor(addresses.GreenGovernor);
    console.log("📤 Transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed in block:", receipt.blockNumber);
    
    console.log("🎉 Governance integration setup complete!");
    
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });