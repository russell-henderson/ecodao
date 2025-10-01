import hre from "hardhat";
import "@nomicfoundation/hardhat-toolbox";

async function main() {
  console.log("🔍 Checking contract state...\n");

  // Read deployed addresses
  const fs = require('fs');
  const path = require('path');
  
  const addressesPath = path.join(__dirname, '../deployed-addresses.json');
  const addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
  
  console.log("📄 Using deployed contracts:", addresses);
  
  // Get signer
  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 User:", deployer.address);

  try {
    // Connect to ActionRewards contract
    const actionRewards = await hre.ethers.getContractAt("ActionRewards", addresses.ActionRewards);
    
    // Check if contract is paused
    const isPaused = await actionRewards.paused();
    console.log("⏸️  Contract paused:", isPaused);
    
    // Check cooldown
    const lastActionTime = await actionRewards.lastActionTime(deployer.address);
    const cooldownPeriod = await actionRewards.COOLDOWN_PERIOD();
    const currentTime = Math.floor(Date.now() / 1000);
    
    console.log("⏰ Last action time:", lastActionTime.toString());
    console.log("⏰ Cooldown period:", cooldownPeriod.toString(), "seconds");
    console.log("⏰ Current time:", currentTime);
    console.log("⏰ Time since last action:", currentTime - Number(lastActionTime));
    console.log("⏰ Cooldown satisfied:", currentTime >= Number(lastActionTime) + Number(cooldownPeriod));
    
    // Check action reward for TREE_PLANTING
    const actionType = 6; // TREE_PLANTING enum value
    const rewardAmount = await actionRewards.actionRewards(actionType);
    console.log("🌱 Tree planting reward:", rewardAmount.toString());
    
    // Try to simulate the call
    try {
      console.log("🧪 Testing submitAction simulation...");
      await actionRewards.submitAction.staticCall("TREE_PLANTING", "QmTestHash123");
      console.log("✅ Simulation successful!");
    } catch (simError) {
      console.log("❌ Simulation failed:", simError);
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