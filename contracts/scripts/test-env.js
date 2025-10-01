// Test environment variables
console.log("Environment check:");
console.log("AMOY_PRIVATE_KEY:", process.env.AMOY_PRIVATE_KEY ? "✅ Set" : "❌ Missing");
console.log("AMOY_RPC:", process.env.AMOY_RPC || "❌ Missing");
console.log("POLYGONSCAN_API_KEY:", process.env.POLYGONSCAN_API_KEY ? "✅ Set" : "❌ Missing");

async function main() {
  const hre = require("hardhat");
  
  console.log("\nNetwork config:");
  console.log("Network name:", hre.network.name);
  
  try {
    const signers = await hre.ethers.getSigners();
    console.log("Number of signers:", signers.length);
    
    if (signers.length > 0) {
      const deployer = signers[0];
      console.log("Deployer address:", deployer.address);
      const balance = await hre.ethers.provider.getBalance(deployer.address);
      const balanceInPOL = hre.ethers.formatEther(balance);
      console.log("Deployer balance:", balanceInPOL, "POL");
      
      // Check if balance is sufficient (rough estimate: 0.5 POL should be enough)
      const balanceFloat = parseFloat(balanceInPOL);
      if (balanceFloat < 0.5) {
        console.log("⚠️  LOW BALANCE - Deployment may fail");
        console.log("💡 Get more test POL from: https://faucet.polygon.technology/");
        console.log("   Select 'Polygon Amoy' and enter:", deployer.address);
      } else {
        console.log("✅ Balance sufficient for deployment");
      }
    } else {
      console.log("❌ No signers available - check private key");
    }
  } catch (error) {
    console.error("❌ Error getting signers:", error.message);
  }
}

main().catch(console.error);