import hre from "hardhat";
import "@nomicfoundation/hardhat-toolbox";

async function main() {
  console.log("🔍 Checking roles and permissions...\n");

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
    
    // Check roles
    const DEFAULT_ADMIN_ROLE = "0x0000000000000000000000000000000000000000000000000000000000000000";
    const hasAdminRole = await actionRewards.hasRole(DEFAULT_ADMIN_ROLE, deployer.address);
    console.log("🔑 Has DEFAULT_ADMIN_ROLE:", hasAdminRole);
    
    // Check if we can call the function directly
    try {
      console.log("🧪 Testing setGovernor call...");
      const estimatedGas = await actionRewards.setGovernor.estimateGas(addresses.GreenGovernor);
      console.log("⛽ Estimated gas:", estimatedGas.toString());
    } catch (estimateError) {
      console.log("❌ Gas estimation failed:", estimateError.message);
      
      // Try to get the revert reason
      try {
        await actionRewards.setGovernor.staticCall(addresses.GreenGovernor);
      } catch (staticError) {
        console.log("❌ Static call failed:", staticError.message);
      }
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