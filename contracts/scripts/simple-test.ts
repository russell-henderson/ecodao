import hre from "hardhat";

async function simpleTest() {
  console.log("🔍 Simple action test...");
  
  const deployedAddresses = require("../deployed-addresses.json");
  console.log("📍 Contract addresses:", deployedAddresses);
  
  const ActionRewards = await hre.ethers.getContractFactory("ActionRewards");
  const actionRewards = ActionRewards.attach(deployedAddresses.ActionRewards);
  
  const [user1] = await hre.ethers.getSigners();
  console.log(`👤 User address: ${user1.address}`);
  
  // Check if contract is paused
  try {
    const isPaused = await actionRewards.paused();
    console.log(`⏸️ Contract paused: ${isPaused}`);
  } catch (e) {
    console.log("❓ Cannot check pause status:", e.message);
  }
  
  // Check cooldown
  try {
    const lastActionTime = await actionRewards.lastActionTime(user1.address);
    console.log(`⏰ Last action time: ${lastActionTime}`);
    console.log(`⏰ Current time: ${Math.floor(Date.now() / 1000)}`);
  } catch (e) {
    console.log("❓ Cannot check cooldown:", e.message);
  }
  
  console.log("📝 Attempting to submit action...");
  try {
    const tx = await actionRewards.connect(user1).submitAction(
      "COMPOSTING",
      "https://ipfs.io/ipfs/QmTestHash",
      { gasLimit: 500000 } // Explicit gas limit
    );
    console.log(`🔄 Transaction sent: ${tx.hash}`);
    
    const receipt = await tx.wait();
    console.log(`✅ Transaction confirmed: ${receipt.transactionHash}`);
    console.log(`⛽ Gas used: ${receipt.gasUsed}`);
    console.log(`📋 Events count: ${receipt.logs.length}`);
    
    // Parse all events
    for (const log of receipt.logs) {
      try {
        const parsed = actionRewards.interface.parseLog(log);
        if (parsed) {
          console.log(`   📝 Event: ${parsed.name}`);
          console.log(`      Args:`, parsed.args.map(arg => arg.toString()));
        }
      } catch (e) {
        console.log("   📄 Unparseable log:", log.topics[0]);
      }
    }
    
  } catch (error) {
    console.error("❌ Transaction failed:", error);
    if (error.reason) {
      console.error("   Reason:", error.reason);
    }
    if (error.data) {
      console.error("   Data:", error.data);
    }
  }
}

simpleTest()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });