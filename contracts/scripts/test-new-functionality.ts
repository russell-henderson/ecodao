import hre from "hardhat";

async function testNewFunctionality() {
  console.log("🧪 Testing new ActionRewards functionality...\n");

  // Get deployed contracts (using hardhat network addresses)
  const greenTokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const actionRewardsAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const greenGovernorAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

  // Get signers
  const [deployer, user1] = await hre.ethers.getSigners();
  
  // Get contract instances
  const actionRewards = await hre.ethers.getContractAt("ActionRewards", actionRewardsAddress);
  const greenGovernor = await hre.ethers.getContractAt("GreenGovernor", greenGovernorAddress);
  const greenToken = await hre.ethers.getContractAt("GreenToken", greenTokenAddress);

  // Test 1: Submit action with new function signature
  console.log("📝 Test 1: Submitting action with new function signature...");
  
  const actionType = "COMPOSTING";
  const metadataURI = "QmTestHash123456789";
  
  try {
    const tx = await actionRewards.connect(user1).submitAction(actionType, metadataURI);
    const receipt = await tx.wait();
    
    console.log("✅ Action submitted successfully!");
    console.log(`   Transaction hash: ${tx.hash}`);
    console.log(`   Gas used: ${receipt.gasUsed.toString()}`);
    
  } catch (error) {
    console.error("❌ Error submitting action:", error);
    return;
  }

  // Test 2: Get action details
  console.log("\n📋 Test 2: Retrieving action details...");
  
  try {
    const action = await actionRewards.getAction(0);
    console.log("✅ Action details retrieved:");
    console.log(`   User: ${action.user}`);
    console.log(`   Action Type: ${action.actionType}`);
    console.log(`   Metadata URI: ${action.metadataURI}`);
    console.log(`   Timestamp: ${action.timestamp}`);
    console.log(`   Status: ${action.status} (0=PENDING, 1=VERIFIED, 2=REJECTED)`);
    console.log(`   Proposal ID: ${action.proposalId}`);
    
  } catch (error) {
    console.error("❌ Error getting action:", error);
    return;
  }

  // Test 3: Check user actions
  console.log("\n👤 Test 3: Getting user actions...");
  
  try {
    const userActions = await actionRewards.getUserActions(user1.address);
    console.log(`✅ User has ${userActions.length} action(s): [${userActions.join(', ')}]`);
    
  } catch (error) {
    console.error("❌ Error getting user actions:", error);
    return;
  }

  // Test 4: Check pending actions
  console.log("\n⏳ Test 4: Getting pending actions...");
  
  try {
    const pendingActions = await actionRewards.getPendingActions();
    console.log(`✅ There are ${pendingActions.length} pending action(s): [${pendingActions.join(', ')}]`);
    
  } catch (error) {
    console.error("❌ Error getting pending actions:", error);
    return;
  }

  console.log("\n🎉 All tests completed!");
}

testNewFunctionality()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });