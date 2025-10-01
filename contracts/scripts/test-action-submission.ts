import hre from "hardhat";
import "@nomicfoundation/hardhat-toolbox";

async function main() {
  console.log("🧪 Testing action submission flow...\n");

  // Read deployed addresses
  const fs = require('fs');
  const path = require('path');
  
  const addressesPath = path.join(__dirname, '../deployed-addresses.json');
  const addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
  
  console.log("📄 Using deployed contracts:", addresses);
  
  // Get signer
  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Submitter:", deployer.address);

  try {
    // Connect to ActionRewards contract
    const actionRewards = await hre.ethers.getContractAt("ActionRewards", addresses.ActionRewards);
    
    // Test action submission
    console.log("🌱 Submitting test action...");
    const actionType = "TREE_PLANTING";
    const metadataURI = "QmTestHash123"; // Mock IPFS hash
    
    const tx = await actionRewards.submitAction(actionType, metadataURI);
    console.log("📤 Transaction sent:", tx.hash);
    
    const receipt = await tx.wait();
    console.log("✅ Transaction confirmed in block:", receipt.blockNumber);
    
    // Check if action was submitted
    const totalActions = await actionRewards.getTotalActions();
    console.log("📊 Total actions now:", totalActions.toString());
    
    // Get user actions
    const userActions = await actionRewards.getUserActions(deployer.address);
    console.log("👤 User actions:", userActions.map(id => id.toString()));
    
    // Get the action details
    if (userActions.length > 0) {
      const actionId = userActions[userActions.length - 1]; // Get latest action
      const action = await actionRewards.getAction(actionId);
      console.log("📋 Action details:");
      console.log("  ID:", actionId.toString());
      console.log("  User:", action.user);
      console.log("  Type:", action.actionType);
      console.log("  MetadataURI:", action.metadataURI);
      console.log("  Status:", action.status); // 0=PENDING, 1=VERIFIED, 2=REJECTED
      console.log("  Proposal ID:", action.proposalId.toString());
    }
    
    console.log("🎉 Action submission test complete!");
    
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