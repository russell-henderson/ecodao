import hre from "hardhat";
const { ethers } = hre;
import fs from "fs";
import path from "path";

async function main() {
    console.log("🔧 Setting up governor integration...");
    
    // Read deployed addresses
    const deployedAddressesPath = path.join(__dirname, "..", "deployed-addresses.json");
    const deployedAddresses = JSON.parse(fs.readFileSync(deployedAddressesPath, "utf8"));
    
    console.log("📄 Using deployed addresses:", deployedAddresses);
    
    // Get signers
    const [deployer] = await ethers.getSigners();
    console.log("🔑 Deployer address:", deployer.address);
    
    // Get contract instances
    const ActionRewards = await ethers.getContractAt("ActionRewards", deployedAddresses.ActionRewards);
    console.log("✅ Connected to ActionRewards at:", deployedAddresses.ActionRewards);
    
    try {
        // Check current governor configuration
        let currentGovernor;
        try {
            currentGovernor = await ActionRewards.greenGovernor();
            console.log("🏛️  Current governor address:", currentGovernor);
        } catch (error) {
            console.log("⚠️  Cannot read current governor (contract might not be deployed properly)");
            currentGovernor = "0x0000000000000000000000000000000000000000";
        }
        
        // Set governor if not configured
        if (currentGovernor === "0x0000000000000000000000000000000000000000") {
            console.log("🔧 Setting governor address...");
            const tx = await ActionRewards.setGovernor(deployedAddresses.GreenGovernor);
            await tx.wait();
            console.log("✅ Governor address set successfully!");
            console.log("📝 Transaction hash:", tx.hash);
        } else if (currentGovernor.toLowerCase() === deployedAddresses.GreenGovernor.toLowerCase()) {
            console.log("✅ Governor already properly configured!");
        } else {
            console.log("⚠️  Governor configured but doesn't match expected address");
            console.log("   Current:", currentGovernor);
            console.log("   Expected:", deployedAddresses.GreenGovernor);
        }
        
        // Verify configuration
        const finalGovernor = await ActionRewards.greenGovernor();
        console.log("🏛️  Final governor address:", finalGovernor);
        
        if (finalGovernor.toLowerCase() === deployedAddresses.GreenGovernor.toLowerCase()) {
            console.log("🎉 Governor integration setup complete!");
        } else {
            console.log("❌ Governor integration setup failed");
        }
        
    } catch (error) {
        console.log("❌ Error during setup:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });