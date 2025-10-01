import hre from "hardhat";
import "@nomicfoundation/hardhat-toolbox";

async function main() {
  console.log("🔧 Setting up governance integration...\n");

  // Read deployed addresses
  const fs = require('fs');
  const path = require('path');
  
  const addressesPath = path.join(__dirname, '../deployed-addresses.json');
  const addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
  
  console.log("📄 Using deployed contracts:", addresses);
  
  // Get signer
  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);

  // Connect to ActionRewards contract
  const actionRewards = await hre.ethers.getContractAt("ActionRewards", addresses.ActionRewards);
  
  try {
    // Check current governor setting
    const currentGovernor = await actionRewards.greenGovernor();
    console.log("🏛️  Current governor:", currentGovernor);
    
    if (currentGovernor === "0x0000000000000000000000000000000000000000") {
      console.log("⚡ Setting governor address...");
      const tx = await actionRewards.setGovernor(addresses.GreenGovernor);
      await tx.wait();
      console.log("✅ Governor set successfully!");
    } else {
      console.log("✅ Governor already set!");
    }
    
    // Verify the setting
    const newGovernor = await actionRewards.greenGovernor();
    console.log("🏛️  Governor now set to:", newGovernor);
    
    if (newGovernor.toLowerCase() === addresses.GreenGovernor.toLowerCase()) {
      console.log("🎉 Governance integration setup complete!");
    } else {
      console.log("❌ Governor setting failed");
    }
    
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