import { ethers } from "hardhat";

async function debugAction() {
  console.log("🔍 Debugging action storage...");
  
  // Get deployed contract addresses
  const deployedAddresses = require("../deployed-addresses.json");
  const actionRewardsAddress = deployedAddresses.ActionRewards;
  
  const ActionRewards = await ethers.getContractFactory("ActionRewards");
  const actionRewards = ActionRewards.attach(actionRewardsAddress);
  
  const [user1] = await ethers.getSigners();
  
  console.log("📝 Submitting action...");
  const tx = await actionRewards.connect(user1).submitAction(
    "COMPOSTING",
    "https://ipfs.io/ipfs/QmTestHash"
  );
  const receipt = await tx.wait();
  console.log(`✅ Transaction mined: ${receipt.transactionHash}`);
  
  // Check the events emitted
  console.log("📋 Events emitted:");
  for (const event of receipt.logs) {
    try {
      const parsed = actionRewards.interface.parseLog(event);
      if (parsed) {
        console.log(`   Event: ${parsed.name}`);
        console.log(`   Args:`, parsed.args);
      }
    } catch (e) {
      // Ignore unparseable events
    }
  }
  
  // Try to get action by ID from events
  const actionSubmittedEvent = receipt.logs.find(log => {
    try {
      const parsed = actionRewards.interface.parseLog(log);
      return parsed && parsed.name === "ActionSubmitted";
    } catch {
      return false;
    }
  });
  
  if (actionSubmittedEvent) {
    const parsed = actionRewards.interface.parseLog(actionSubmittedEvent);
    const actionId = parsed.args[0];
    console.log(`\n🎯 Action ID from event: ${actionId}`);
    
    try {
      const action = await actionRewards.getAction(actionId);
      console.log("✅ Action retrieved successfully:");
      console.log(`   User: ${action.user}`);
      console.log(`   Action Type: ${action.actionType}`);
      console.log(`   Metadata URI: ${action.metadataURI}`);
      console.log(`   Status: ${action.status}`);
    } catch (error) {
      console.error("❌ Error getting action:", error);
    }
  } else {
    console.log("❌ No ActionSubmitted event found");
  }
}

debugAction()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });