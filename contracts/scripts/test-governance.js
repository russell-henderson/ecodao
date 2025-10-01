// Quick governance test script for local deployment
const hre = require("hardhat");

async function main() {
  console.log("🧪 Testing EcoDAO Governance Locally\n");

  // Contract addresses from the deployment
  const addresses = {
    greenToken: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    actionRewards: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    governor: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    treasury: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
  };

  // Get contracts
  const greenToken = await hre.ethers.getContractAt("GreenToken", addresses.greenToken);
  const actionRewards = await hre.ethers.getContractAt("ActionRewards", addresses.actionRewards);
  const governor = await hre.ethers.getContractAt("GreenGovernor", addresses.governor);

  // Get signers
  const [deployer, user1] = await hre.ethers.getSigners();
  
  console.log("👤 Deployer:", deployer.address);
  console.log("👤 User1:", user1.address);
  console.log();

  // Check initial balances
  const deployerBalance = await greenToken.balanceOf(deployer.address);
  const user1Balance = await greenToken.balanceOf(user1.address);
  
  console.log("💰 Initial Token Balances:");
  console.log("   Deployer:", hre.ethers.formatEther(deployerBalance), "GREEN");
  console.log("   User1:", hre.ethers.formatEther(user1Balance), "GREEN");
  console.log();

  // Test 1: Submit and verify actions to earn tokens
  console.log("🎯 Test 1: Earning tokens through actions");
  
  // Submit actions for both users
  console.log("📸 Submitting environmental actions...");
  await actionRewards.connect(deployer).submitAction(0, "deployer-composting-photo");
  await actionRewards.connect(user1).submitAction(1, "user1-cycling-photo");
  
  // Verify actions (deployer can verify since they're in the verifier role)
  console.log("✅ Verifying actions...");
  await actionRewards.connect(deployer).verifyAction(0, true, "Good composting setup!");
  await actionRewards.connect(deployer).verifyAction(1, true, "Great cycling activity!");
  
  // Check new balances
  const newDeployerBalance = await greenToken.balanceOf(deployer.address);
  const newUser1Balance = await greenToken.balanceOf(user1.address);
  
  console.log("💰 New Token Balances After Actions:");
  console.log("   Deployer:", hre.ethers.formatEther(newDeployerBalance), "GREEN");
  console.log("   User1:", hre.ethers.formatEther(newUser1Balance), "GREEN");
  console.log();

  // Test 2: Delegate tokens for voting power
  console.log("🎯 Test 2: Setting up voting power");
  
  console.log("🗳️ Delegating tokens for voting power...");
  await greenToken.connect(deployer).delegate(deployer.address);
  await greenToken.connect(user1).delegate(user1.address);
  
  // Check voting power
  const deployerVotes = await greenToken.getVotes(deployer.address);
  const user1Votes = await greenToken.getVotes(user1.address);
  
  console.log("🗳️ Voting Power:");
  console.log("   Deployer:", hre.ethers.formatEther(deployerVotes), "votes");
  console.log("   User1:", hre.ethers.formatEther(user1Votes), "votes");
  console.log();

  // Test 3: Create a governance proposal
  console.log("🎯 Test 3: Creating governance proposal");
  
  const proposalThreshold = await governor.proposalThreshold();
  console.log("📊 Proposal threshold:", hre.ethers.formatEther(proposalThreshold), "tokens");
  
  if (deployerVotes >= proposalThreshold) {
    console.log("📝 Creating a test proposal...");
    
    // Create a simple proposal
    const targets = [addresses.treasury];
    const values = [0];
    const calldatas = ["0x"];
    const description = "Test Proposal: Allocate 100 GREEN tokens for community tree planting initiative";
    
    const proposalTx = await governor.connect(deployer).propose(targets, values, calldatas, description);
    const receipt = await proposalTx.wait();
    
    // Find the ProposalCreated event
    const proposalEvent = receipt.logs.find(log => {
      try {
        const parsed = governor.interface.parseLog(log);
        return parsed?.name === 'ProposalCreated';
      } catch {
        return false;
      }
    });
    
    if (proposalEvent) {
      const parsed = governor.interface.parseLog(proposalEvent);
      const proposalId = parsed.args[0];
      
      console.log("✅ Proposal created successfully!");
      console.log("   Proposal ID:", proposalId.toString());
      
      // Check proposal state
      const state = await governor.state(proposalId);
      const stateNames = ["Pending", "Active", "Canceled", "Defeated", "Succeeded", "Queued", "Expired", "Executed"];
      console.log("   Proposal State:", stateNames[state], `(${state})`);
      
      // Get proposal details
      const proposal = await governor.proposals(proposalId);
      console.log("   Proposal Details:");
      console.log("     - Proposer:", proposal.proposer);
      console.log("     - Vote Start:", proposal.voteStart.toString());
      console.log("     - Vote End:", proposal.voteEnd.toString());
      
    } else {
      console.log("✅ Proposal transaction successful!");
    }
    
  } else {
    console.log("⚠️  Need more tokens to create proposals");
    console.log("   Required:", hre.ethers.formatEther(proposalThreshold), "votes");
    console.log("   Current:", hre.ethers.formatEther(deployerVotes), "votes");
    console.log("   💡 Submit more actions to earn tokens!");
  }

  console.log("\n🎉 Local testing complete!");
  console.log("==================================================");
  console.log("🌐 Frontend running at: http://localhost:3000");
  console.log("📋 Use these test accounts in MetaMask:");
  console.log("   Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  console.log("   User1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
  console.log("🔧 Network: Hardhat Local (Chain ID: 1337)");
  console.log("📚 See LOCAL_TESTING_GUIDE.md for detailed instructions");
  console.log("==================================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });