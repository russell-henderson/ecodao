// Quick environment check script
const fs = require('fs');
const path = require('path');

console.log("🔍 EcoDAO Environment Check\n");

// Check if we're in the right directory
const currentDir = process.cwd();
console.log("📍 Current directory:", currentDir);

if (!currentDir.includes('contracts')) {
  console.log("⚠️  Run this from the contracts directory: cd contracts");
}

// Check for required files
const requiredFiles = [
  'hardhat.config.ts',
  'package.json', 
  'scripts/deploy.ts',
  'contracts/GreenToken.sol'
];

console.log("\n📋 Required files:");
requiredFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// Check environment variables
console.log("\n🌍 Environment variables:");

const envFile = '.env';
const hasEnv = fs.existsSync(envFile);
console.log(`   ${hasEnv ? '✅' : '⚠️ '} .env file ${hasEnv ? 'exists' : 'missing'}`);

if (hasEnv) {
  const envContent = fs.readFileSync(envFile, 'utf8');
  const hasPrivateKey = envContent.includes('PRIVATE_KEY');
  const hasRpc = envContent.includes('AMOY_RPC');
  
  console.log(`   ${hasPrivateKey ? '✅' : '⚠️ '} PRIVATE_KEY ${hasPrivateKey ? 'set' : 'missing'}`);
  console.log(`   ${hasRpc ? '✅' : '⚠️ '} AMOY_RPC ${hasRpc ? 'set' : 'missing'}`);
} else {
  console.log("   💡 Create .env file with PRIVATE_KEY and AMOY_RPC");
}

// Check node_modules
const hasNodeModules = fs.existsSync('node_modules');
console.log(`\n📦 Dependencies: ${hasNodeModules ? '✅ Installed' : '❌ Missing - run: npm install'}`);

// Check compiled contracts
const hasArtifacts = fs.existsSync('artifacts/contracts');
console.log(`🔨 Compiled contracts: ${hasArtifacts ? '✅ Ready' : '⚠️  Missing - run: npm run compile'}`);

// Check for deployment addresses
const hasDeployment = fs.existsSync('deployed-addresses.json');
console.log(`🚀 Deployment: ${hasDeployment ? '✅ Deployed' : '⚠️  Not deployed yet'}`);

console.log("\n" + "=".repeat(50));
console.log("🎯 Next Steps:");

if (!hasNodeModules) {
  console.log("1. Install dependencies: npm install");
}

if (!hasEnv) {
  console.log("2. Create .env file with your private key and RPC URL");
}

if (!hasArtifacts) {
  console.log("3. Compile contracts: npm run compile");
}

if (!hasDeployment) {
  console.log("4. Deploy contracts:");
  console.log("   - Local testing: npm run setup:local");
  console.log("   - Amoy testnet: npm run setup:amoy");
}

console.log("5. Start frontend: cd ../frontend && npm run dev");
console.log("6. Connect wallet to correct network and test!");

console.log("\n📚 For detailed instructions, see: COMPLETE_SETUP_GUIDE.md");
console.log("=".repeat(50));