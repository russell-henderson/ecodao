import { ethers } from "hardhat";
import hre from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

async function main() {
  console.log("🚀 Starting EcoDAO contract deployment...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy GreenToken
  console.log("📝 Deploying GreenToken...");
  const GreenToken = await ethers.getContractFactory("GreenToken");
  const greenToken = await GreenToken.deploy(
    "EcoToken",
    "ECO",
    deployer.address
  );
  await greenToken.waitForDeployment();
  const greenTokenAddress = await greenToken.getAddress();
  console.log("✅ GreenToken deployed to:", greenTokenAddress);

  // Deploy ActionRewards
  console.log("🎯 Deploying ActionRewards...");
  const ActionRewards = await ethers.getContractFactory("ActionRewards");
  const actionRewards = await ActionRewards.deploy(greenTokenAddress);
  await actionRewards.waitForDeployment();
  const actionRewardsAddress = await actionRewards.getAddress();
  console.log("✅ ActionRewards deployed to:", actionRewardsAddress);

  // Grant MINTER_ROLE to ActionRewards
  console.log("🔐 Granting MINTER_ROLE to ActionRewards...");
  const MINTER_ROLE = await greenToken.MINTER_ROLE();
  await greenToken.grantRole(MINTER_ROLE, actionRewardsAddress);
  console.log("✅ MINTER_ROLE granted to ActionRewards");

  // Deploy TimelockController for governance
  console.log("⏰ Deploying TimelockController...");
  const TimelockController = await ethers.getContractFactory("TimelockController");
  const timelock = await TimelockController.deploy(
    2 * 24 * 60 * 60, // 2 days delay
    [deployer.address], // proposers
    [deployer.address], // executors
    deployer.address // admin
  );
  await timelock.waitForDeployment();
  const timelockAddress = await timelock.getAddress();
  console.log("✅ TimelockController deployed to:", timelockAddress);

  // Deploy GreenGovernor
  console.log("🗳️ Deploying GreenGovernor...");
  const GreenGovernor = await ethers.getContractFactory("GreenGovernor");
  const greenGovernor = await GreenGovernor.deploy(
    greenTokenAddress, // voting token
    timelockAddress,   // timelock
    1 * 24 * 60 * 60,  // voting delay: 1 day
    7 * 24 * 60 * 60,  // voting period: 7 days
    ethers.parseEther("100"), // proposal threshold: 100 EcoTokens
    10                 // quorum percentage: 10%
  );
  await greenGovernor.waitForDeployment();
  const greenGovernorAddress = await greenGovernor.getAddress();
  console.log("✅ GreenGovernor deployed to:", greenGovernorAddress);

  // Deploy CommunityTreasury
  console.log("💰 Deploying CommunityTreasury...");
  const CommunityTreasury = await ethers.getContractFactory("CommunityTreasury");
  const communityTreasury = await CommunityTreasury.deploy(greenTokenAddress);
  await communityTreasury.waitForDeployment();
  const communityTreasuryAddress = await communityTreasury.getAddress();
  console.log("✅ CommunityTreasury deployed to:", communityTreasuryAddress);

  // Set up initial verifiers
  console.log("👥 Setting up initial verifiers...");
  await actionRewards.addVerifier(deployer.address, 50); // Deployer starts with 50 reputation
  await communityTreasury.addVerifier(deployer.address);
  console.log("✅ Initial verifiers set up");

  // Transfer some tokens to treasury for initial funding
  console.log("💸 Funding treasury...");
  const treasuryAmount = ethers.parseEther("1000000"); // 1M EcoTokens
  await greenToken.transfer(communityTreasuryAddress, treasuryAmount);
  console.log("✅ Treasury funded with 1M EcoTokens");

  // Summary
  console.log("\n🎉 Deployment completed successfully!");
  console.log("==================================================");
  console.log("Contract Addresses:");
  console.log("GreenToken:", greenTokenAddress);
  console.log("ActionRewards:", actionRewardsAddress);
  console.log("TimelockController:", timelockAddress);
  console.log("GreenGovernor:", greenGovernorAddress);
  console.log("CommunityTreasury:", communityTreasuryAddress);
  console.log("==================================================");

  // Save addresses to file for frontend use
  const addresses = {
    GreenToken: greenTokenAddress,
    ActionRewards: actionRewardsAddress,
    TimelockController: timelockAddress,
    GreenGovernor: greenGovernorAddress,
    CommunityTreasury: communityTreasuryAddress,
    network: "amoy"
  };

  const fs = require('fs');
  const path = require('path');
  fs.writeFileSync(
    './deployed-addresses.json',
    JSON.stringify(addresses, null, 2)
  );
  console.log("📄 Contract addresses saved to deployed-addresses.json");

  // Write TypeScript addresses file for the frontend
  try {
    const frontendAddressesPath = path.join(__dirname, '../../frontend/src/lib/addresses.generated.ts');
    const tsContent = `// Auto-generated by contracts/scripts/deploy.ts\n// Do not edit manually.\n\nexport const addresses = {\n  network: 'amoy',\n  GreenToken: '${greenTokenAddress}',\n  ActionRewards: '${actionRewardsAddress}',\n  TimelockController: '${timelockAddress}',\n  GreenGovernor: '${greenGovernorAddress}',\n  CommunityTreasury: '${communityTreasuryAddress}'\n} as const;\n\nexport type DeployedAddresses = typeof addresses;\nexport default addresses;\n`;
    fs.writeFileSync(frontendAddressesPath, tsContent);
    console.log('📄 Frontend addresses written to src/lib/addresses.generated.ts');
  } catch (e) {
    console.warn('⚠️ Could not write frontend addresses file:', e);
  }

  // Verify contracts on Polygonscan (if on testnet)
  if (process.env.AMOY_RPC) {
    console.log("\n🔍 Verifying contracts on Polygonscan...");
    try {
      await greenToken.waitForDeployment();
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      
      console.log("Verifying GreenToken...");
      await hre.run("verify:verify", {
        address: greenTokenAddress,
        constructorArguments: [
          "EcoToken",
          "ECO",
          deployer.address
        ],
      });
      console.log("✅ GreenToken verified");
    } catch (error) {
      console.log("⚠️ Verification failed:", error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
