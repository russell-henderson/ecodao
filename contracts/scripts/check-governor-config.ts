import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
    console.log("🔍 Checking governor configuration...");
    
    // Read deployed addresses
    const deployedAddressesPath = path.join(__dirname, "..", "deployed-addresses.json");
    if (!fs.existsSync(deployedAddressesPath)) {
        console.log("❌ No deployed-addresses.json found");
        return;
    }
    
    const deployedAddresses = JSON.parse(fs.readFileSync(deployedAddressesPath, "utf8"));
    console.log("📄 Found deployed addresses:", deployedAddresses);
    
    try {
        // Get contract instances using the real deployed addresses from the success file
        const realAddresses = {
            GreenToken: "0xB6b52DB513Ace728bEdDc047576172796C8DC41f",
            ActionRewards: "0xfce5C3168431fD6796cb5595c017594beEB310aC",
            GreenGovernor: "0x275C414D5E2D454830FD2edB11B2b2E998cC41bE",
            CommunityTreasury: "0xD79C048fa009b3D2E8CAd84238f1BC966f7Eec47"
        };
        
        const ActionRewards = await ethers.getContractAt("ActionRewards", realAddresses.ActionRewards);
        const GreenGovernor = await ethers.getContractAt("GreenGovernor", realAddresses.GreenGovernor);
        
        console.log("✅ Connected to contracts");
        
        // Check if governor is configured in ActionRewards
        try {
            const configuredGovernor = await ActionRewards.greenGovernor();
            console.log("🏛️  Governor address in ActionRewards:", configuredGovernor);
            console.log("🏛️  Expected Governor address:", realAddresses.GreenGovernor);
            
            if (configuredGovernor.toLowerCase() === realAddresses.GreenGovernor.toLowerCase()) {
                console.log("✅ Governor properly configured!");
            } else if (configuredGovernor === "0x0000000000000000000000000000000000000000") {
                console.log("⚠️  Governor not configured - needs setGovernor() call");
            } else {
                console.log("❌ Governor misconfigured");
            }
        } catch (error) {
            console.log("❌ Error checking governor:", error);
        }
        
        // Check some basic contract info
        const tokenName = await (await ethers.getContractAt("GreenToken", realAddresses.GreenToken)).name();
        console.log("🪙 Token name:", tokenName);
        
    } catch (error) {
        console.log("❌ Error:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });