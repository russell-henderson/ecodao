import hre from "hardhat";
import fs from "fs";
import path from "path";

const { ethers } = hre;

async function main() {
    console.log("🔍 Verifying contracts on Polygonscan...");
    
    // Read deployed addresses
    const deployedAddressesPath = path.join(__dirname, "..", "deployed-addresses.json");
    const deployedAddresses = JSON.parse(fs.readFileSync(deployedAddressesPath, "utf8"));
    
    console.log("📄 Contract addresses:", deployedAddresses);
    
    const deployer = "0x8cE92d77B99a7A7Cc6dD75D211878E59faDe13b1";
    
    try {
        // Verify GreenToken
        console.log("🪙 Verifying GreenToken...");
        await hre.run("verify:verify", {
            address: deployedAddresses.GreenToken,
            constructorArguments: ["EcoToken", "ECO", deployer],
        });
        console.log("✅ GreenToken verified");
        
        // Verify ActionRewards
        console.log("🎯 Verifying ActionRewards...");
        await hre.run("verify:verify", {
            address: deployedAddresses.ActionRewards,
            constructorArguments: [deployedAddresses.GreenToken],
        });
        console.log("✅ ActionRewards verified");
        
        // Verify TimelockController
        console.log("⏰ Verifying TimelockController...");
        await hre.run("verify:verify", {
            address: deployedAddresses.TimelockController,
            constructorArguments: [
                86400, // 1 day delay
                [deployer], // proposers
                [deployer], // executors
                deployer // admin
            ],
        });
        console.log("✅ TimelockController verified");
        
        // Verify GreenGovernor
        console.log("🏛️ Verifying GreenGovernor...");
        await hre.run("verify:verify", {
            address: deployedAddresses.GreenGovernor,
            constructorArguments: [
                deployedAddresses.GreenToken, // voting token
                deployedAddresses.TimelockController, // timelock
                86400, // voting delay: 1 day
                604800, // voting period: 7 days
                ethers.parseEther("100"), // proposal threshold: 100 EcoTokens
                10 // quorum percentage: 10%
            ],
        });
        console.log("✅ GreenGovernor verified");
        
        // Verify CommunityTreasury
        console.log("💰 Verifying CommunityTreasury...");
        await hre.run("verify:verify", {
            address: deployedAddresses.CommunityTreasury,
            constructorArguments: [deployedAddresses.GreenToken],
        });
        console.log("✅ CommunityTreasury verified");
        
        console.log("\n🎉 All contracts verified successfully!");
        console.log("View them on Polygonscan:");
        console.log("GreenToken:", `https://amoy.polygonscan.com/address/${deployedAddresses.GreenToken}`);
        console.log("ActionRewards:", `https://amoy.polygonscan.com/address/${deployedAddresses.ActionRewards}`);
        console.log("TimelockController:", `https://amoy.polygonscan.com/address/${deployedAddresses.TimelockController}`);
        console.log("GreenGovernor:", `https://amoy.polygonscan.com/address/${deployedAddresses.GreenGovernor}`);
        console.log("CommunityTreasury:", `https://amoy.polygonscan.com/address/${deployedAddresses.CommunityTreasury}`);
        
    } catch (error) {
        console.error("❌ Verification failed:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });