const fs = require('fs');
const path = require('path');

// Read deployed addresses
const addressesPath = path.join(__dirname, '../deployed-addresses.json');
const frontendContractsPath = path.join(__dirname, '../../frontend/src/lib/contracts.ts');

if (!fs.existsSync(addressesPath)) {
  console.log('❌ deployed-addresses.json not found. Please deploy contracts first.');
  process.exit(1);
}

const addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
console.log('📄 Found deployed addresses:', addresses);

// Read frontend contracts file
let contractsContent = fs.readFileSync(frontendContractsPath, 'utf8');

// Update Amoy addresses
contractsContent = contractsContent.replace(
  /amoy: {\s*GreenToken: '[^']*',\s*GreenGovernor: '[^']*',\s*ActionRewards: '[^']*',\s*CommunityTreasury: '[^']*',\s*}/s,
  `amoy: {
    GreenToken: '${addresses.GreenToken}',
    GreenGovernor: '${addresses.GreenGovernor}',
    ActionRewards: '${addresses.ActionRewards}',
    CommunityTreasury: '${addresses.CommunityTreasury}',
  }`
);

// Write updated file
fs.writeFileSync(frontendContractsPath, contractsContent);

console.log('✅ Updated frontend contract addresses');
console.log('📄 Updated file:', frontendContractsPath);
console.log('🚀 You can now start the frontend with: cd ../frontend && npm run dev');
