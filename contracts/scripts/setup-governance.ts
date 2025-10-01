// Setup script for testing governance and proposals
import hre from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

const { ethers } = hre;

async function main() {
  console.log("🔧 Setting up EcoDAO for governance testing...\n");

  // Get signers
  const [deployer, user1, user2] = await hre.ethers.getSigners();
  console.log("👤 Deployer:", deployer.address);
  console.log("👤 User1:", user1.address);
  console.log("👤 User2:", user2.address);

  // Get deployed contract addresses
  const fs = require('fs');
  const path = require('path');
  
  let addresses;
  try {
    const addressesPath = path.join(__dirname, '../deployed-addresses.json');
    addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
    console.log("📄 Using deployed contracts from deployed-addresses.json");
  } catch (error) {
    console.log("❌ No deployed-addresses.json found. Please deploy contracts first:");
    console.log("   npm run deploy:local  (for local testing)");
    console.log("   npm run deploy:amoy   (for Amoy testnet)");
    return;
  }

  // Connect to contracts
  const GreenToken = await hre.ethers.getContractFactory("GreenToken");
  const ActionRewards = await ethers.getContractFactory("ActionRewards");
  const GreenGovernor = await ethers.getContractFactory("GreenGovernor");
  
  const greenToken = GreenToken.attach(addresses.GreenToken);
  const actionRewards = ActionRewards.attach(addresses.ActionRewards);
  const greenGovernor = GreenGovernor.attach(addresses.GreenGovernor);

  console.log("\n🔍 Current contract status:");

  // Check governance parameters
  const proposalThreshold = await greenGovernor.proposalThreshold();
  const votingDelay = await greenGovernor.votingDelay();
  const votingPeriod = await greenGovernor.votingPeriod();
  
  console.log("📊 Governance Parameters:");
  console.log("   Proposal Threshold:", ethers.formatEther(proposalThreshold), "tokens");
  console.log("   Voting Delay:", votingDelay.toString(), "blocks");
  console.log("   Voting Period:", votingPeriod.toString(), "blocks");

  // Check token balances
  const deployerBalance = await greenToken.balanceOf(deployer.address);
  const user1Balance = await greenToken.balanceOf(user1.address);
  
  console.log("\n💰 Token Balances:");
  console.log("   Deployer:", ethers.formatEther(deployerBalance), "tokens");
  console.log("   User1:", ethers.formatEther(user1Balance), "tokens");

  // Check voting power (delegation)
  const deployerVotes = await greenToken.getVotes(deployer.address);
  const user1Votes = await greenToken.getVotes(user1.address);
  
  console.log("\n🗳️ Voting Power:");
  console.log("   Deployer:", ethers.formatEther(deployerVotes), "votes");
  console.log("   User1:", ethers.formatEther(user1Votes), "votes");

  // Setup for proposal creation if not already done
  console.log("\n🎯 Setting up for proposal creation...");

  // Ensure deployer has enough tokens
  if (deployerBalance < proposalThreshold) {
    console.log("⚠️  Deployer needs more tokens for proposal creation");
    
    // Check if we can mint tokens via ActionRewards (for testing)
    try {
      console.log("🔄 Attempting to grant tokens via ActionRewards...");
      
      // Submit a test action
      await actionRewards.connect(deployer).submitAction(0, "test-ipfs-hash");
      console.log("✅ Test action submitted");
      
      // Auto-verify the action (since we're the verifier)
      const actionId = await actionRewards.getTotalActions() - 1n;
      await actionRewards.connect(deployer).verifyAction(actionId, true, "Test verification");
      console.log("✅ Test action verified and tokens granted");
      
      // Check new balance
      const newBalance = await greenToken.balanceOf(deployer.address);
      console.log("💰 New deployer balance:", ethers.formatEther(newBalance), "tokens");
      
    } catch (error) {
      console.log("⚠️  Could not automatically grant tokens. You may need to:");
      console.log("   1. Submit environmental actions through the frontend");
      console.log("   2. Get them verified by the community");
      console.log("   3. Or manually send tokens from the treasury");
    }
  }

  // Delegate tokens for voting power
  if (deployerVotes === 0n && deployerBalance > 0n) {
    console.log("🔄 Delegating tokens to self for voting power...");
    await greenToken.connect(deployer).delegate(deployer.address);
    console.log("✅ Tokens delegated to self");
    
    const newVotes = await greenToken.getVotes(deployer.address);
    console.log("🗳️ New voting power:", ethers.formatEther(newVotes), "votes");
  }

  // Test proposal creation
  console.log("\n📝 Testing proposal creation...");
  
  const currentVotes = await greenToken.getVotes(deployer.address);
  if (currentVotes >= proposalThreshold) {
    console.log("✅ Sufficient voting power for proposal creation");
    
    // Create a simple test proposal
    const targets = ["0x0000000000000000000000000000000000000000"];
    const values = [0];
    const calldatas = ["0x"];
    const description = "Test Proposal: This is a test proposal to verify governance functionality";
    
    try {
      console.log("🔄 Creating test proposal...");
      const tx = await greenGovernor.connect(deployer).propose(targets, values, calldatas, description);
      const receipt = await tx.wait();
      
      // Find the ProposalCreated event
      const event = receipt.logs.find(log => {
        try {
          const parsed = greenGovernor.interface.parseLog(log);
          return parsed?.name === 'ProposalCreated';
        } catch {
          return false;
        }
      });
      
      if (event) {
        const parsed = greenGovernor.interface.parseLog(event);
        const proposalId = parsed?.args[0];
        console.log("✅ Test proposal created!");
        console.log("   Proposal ID:", proposalId.toString());
        
        // Check proposal state
        const state = await greenGovernor.state(proposalId);
        console.log("   Proposal State:", state.toString(), "(0=Pending, 1=Active, 2=Canceled, 3=Defeated, 4=Succeeded, 5=Queued, 6=Expired, 7=Executed)");
        
      } else {
        console.log("✅ Proposal transaction successful but couldn't find ProposalCreated event");
      }
      
    } catch (error) {
      const err = error as Error;
      console.log("❌ Failed to create proposal:", err.message);
      
      if (err.message.includes("GovernorUnexpectedProposalState")) {
        console.log("💡 This might be due to voting delay. Wait a few blocks and try again.");
      } else if (err.message.includes("GovernorInsufficientProposerVotes")) {
        console.log("💡 Insufficient voting power. Need", ethers.formatEther(proposalThreshold), "votes.");
      }
    }
    
  } else {
    console.log("❌ Insufficient voting power for proposal creation");
    console.log("   Required:", ethers.formatEther(proposalThreshold), "votes");
    console.log("   Current:", ethers.formatEther(currentVotes), "votes");
    console.log("   Need:", ethers.formatEther(proposalThreshold - currentVotes), "more votes");
  }

  console.log("\n🎉 Setup complete!");
  console.log("==================================================");
  console.log("📋 Next steps:");
  console.log("1. 🌐 Start the frontend: cd ../frontend && npm run dev");
  console.log("2. 🔗 Connect wallet to the correct network");
  console.log("3. 📸 Submit environmental actions to earn tokens");
  console.log("4. 🗳️ Delegate tokens to yourself for voting power");
  console.log("5. 📝 Create proposals through the governance interface");
  console.log("==================================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  });