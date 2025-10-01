import hre from "hardhat";

async function main() {
  console.log("🧪 Testing EcoDAO Phase 3 deployment...\n");

  const [deployer, user1, user2] = await hre.ethers.getSigners();
  
  console.log("Deploying contracts...");
  
  // Deploy GreenToken
  const GreenToken = await hre.ethers.getContractFactory("GreenToken");
  const greenToken = await GreenToken.deploy("EcoToken", "ECO", deployer.address);
  await greenToken.waitForDeployment();
  console.log("✅ GreenToken deployed");

  // Deploy EcoPoints
  const EcoPoints = await hre.ethers.getContractFactory("EcoPoints");
  const ecoPoints = await EcoPoints.deploy("EcoPoints", "XP", deployer.address);
  await ecoPoints.waitForDeployment();
  console.log("✅ EcoPoints deployed");

  // Deploy ProjectRegistry
  const ProjectRegistry = await hre.ethers.getContractFactory("ProjectRegistry");
  const projectRegistry = await ProjectRegistry.deploy(
    await greenToken.getAddress(),
    await ecoPoints.getAddress(),
    deployer.address
  );
  await projectRegistry.waitForDeployment();
  console.log("✅ ProjectRegistry deployed");

  // Deploy ChallengeRegistry
  const ChallengeRegistry = await hre.ethers.getContractFactory("ChallengeRegistry");
  const challengeRegistry = await ChallengeRegistry.deploy(
    await ecoPoints.getAddress(),
    deployer.address
  );
  await challengeRegistry.waitForDeployment();
  console.log("✅ ChallengeRegistry deployed");

  // Grant roles
  const MINTER_ROLE = await ecoPoints.MINTER_ROLE();
  await ecoPoints.grantRole(MINTER_ROLE, await projectRegistry.getAddress());
  await ecoPoints.grantRole(MINTER_ROLE, await challengeRegistry.getAddress());
  console.log("✅ MINTER_ROLE granted to both registries");

  // Transfer some ECO tokens to users
  const transferAmount = hre.ethers.parseEther("10000");
  await greenToken.transfer(user1.address, transferAmount);
  await greenToken.transfer(user2.address, transferAmount);
  console.log("✅ ECO tokens distributed to test users");

  console.log("\n🎯 Testing Project Flow...");
  
  // Create a project
  const projectTx = await projectRegistry.connect(user1).createProject(
    "Solar Panel Installation",
    "Install solar panels in rural communities",
    "ipfs://QmExampleProject123",
    hre.ethers.parseEther("50000")
  );
  await projectTx.wait();
  console.log("✅ Project created by user1");

  // User2 contributes to the project
  const contributeAmount = hre.ethers.parseEther("1000");
  await greenToken.connect(user2).approve(await projectRegistry.getAddress(), contributeAmount);
  const contributeTx = await projectRegistry.connect(user2).contribute(0, contributeAmount);
  await contributeTx.wait();
  console.log("✅ User2 contributed 1000 ECO");

  // Check XP balance
  const xpBalance = await ecoPoints.balanceOf(user2.address);
  console.log(`✅ User2 earned ${hre.ethers.formatEther(xpBalance)} XP points`);

  console.log("\n🏆 Testing Challenge Flow...");
  
  // Join a challenge
  const joinTx = await challengeRegistry.connect(user1).join(0); // Green Commute Day
  await joinTx.wait();
  console.log("✅ User1 joined Green Commute Day challenge");

  // Check XP balance
  const user1XpBalance = await ecoPoints.balanceOf(user1.address);
  console.log(`✅ User1 earned ${hre.ethers.formatEther(user1XpBalance)} XP points`);

  console.log("\n📊 Final Summary:");
  console.log("=".repeat(50));
  console.log(`GreenToken: ${await greenToken.getAddress()}`);
  console.log(`EcoPoints: ${await ecoPoints.getAddress()}`);
  console.log(`ProjectRegistry: ${await projectRegistry.getAddress()}`);
  console.log(`ChallengeRegistry: ${await challengeRegistry.getAddress()}`);
  console.log("=".repeat(50));
  console.log(`User1 XP: ${hre.ethers.formatEther(user1XpBalance)}`);
  console.log(`User2 XP: ${hre.ethers.formatEther(xpBalance)}`);
  console.log(`Total Projects: ${await projectRegistry.projectCount()}`);
  console.log(`Active Challenges: ${(await challengeRegistry.getActiveChallenges()).length}`);
  console.log("=".repeat(50));

  console.log("\n🎉 Phase 3 deployment and testing completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });