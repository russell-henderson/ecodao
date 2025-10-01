# EcoDAO Deployment Guide 🚀

This guide covers how to build and deploy the EcoDAO project, including both the frontend (Next.js) and smart contracts (Solidity).

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- Git
- MetaMask wallet
- Polygon/Mumbai testnet MATIC tokens
- Environment variables configured

## 🏗️ Project Structure

```
verdao/
├── frontend/          # Next.js React application
├── contracts/         # Hardhat smart contracts
├── DEPLOYMENT.md      # This guide
└── README.md          # Project overview
```

## 🔧 Environment Setup

### 1. Frontend Environment Variables

Create `frontend/.env.local`:

```bash
# WalletConnect Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your-walletconnect-project-id

# IPFS Configuration (Optional)
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
NEXT_PUBLIC_IPFS_API_URL=https://ipfs.infura.io:5001
NEXT_PUBLIC_IPFS_AUTH=your-ipfs-auth-token

# Contract Addresses (After deployment)
NEXT_PUBLIC_GREEN_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_GREEN_GOVERNOR_ADDRESS=0x...
NEXT_PUBLIC_ACTION_REWARDS_ADDRESS=0x...
NEXT_PUBLIC_TREASURY_ADDRESS=0x...

# Chain Configuration
NEXT_PUBLIC_CHAIN_ID=80001  # Mumbai testnet
NEXT_PUBLIC_RPC_URL=https://rpc-mumbai.maticvigil.com
```

### 2. Smart Contracts Environment Variables

Create `contracts/.env`:

```bash
# Private Key (for deployment)
PRIVATE_KEY=your-wallet-private-key

# RPC URLs
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
POLYGON_RPC_URL=https://polygon-rpc.com

# API Keys
POLYGONSCAN_API_KEY=your-polygonscan-api-key

# Gas Reporting (Optional)
REPORT_GAS=true
```

## 🏭 Smart Contract Deployment

### 1. Install Dependencies

```bash
cd contracts
npm install
```

### 2. Compile Contracts

```bash
npm run compile
```

### 3. Run Tests

```bash
npm run test
```

### 4. Deploy to Networks

#### Local Development (Hardhat Network)

```bash
# Start local node
npx hardhat node

# Deploy contracts (in another terminal)
npm run deploy:local
```

#### Mumbai Testnet

```bash
npm run deploy:mumbai
```

#### Polygon Mainnet

```bash
npm run deploy:polygon
```

### 5. Verify Contracts (Optional)

```bash
# Verify on Mumbai
npm run verify:mumbai

# Verify on Polygon
npm run verify:polygon
```

### 6. Update Frontend Configuration

After deployment, update the contract addresses in `frontend/.env.local` with the deployed addresses from the deployment output.

## 🌐 Frontend Deployment

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Build for Production

```bash
npm run build
```

### 3. Start Production Server

```bash
npm run start
```

### 4. Development Server

```bash
npm run dev
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Frontend)

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Deploy**:

   ```bash
   cd frontend
   vercel
   ```

3. **Environment Variables**: Add your environment variables in the Vercel dashboard

4. **Custom Domain**: Configure your custom domain in Vercel settings

### Option 2: Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `out` (if using static export) or `.next`
3. **Environment Variables**: Add in Netlify dashboard

### Option 3: Self-Hosted (VPS/Cloud)

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Use PM2 for process management**:

   ```bash
   npm install -g pm2
   pm2 start npm --name "ecodao-frontend" -- start
   ```

3. **Configure Nginx** (example):

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy EcoDAO

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd frontend
        npm ci
        
    - name: Build
      run: |
        cd frontend
        npm run build
      env:
        NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: ${{ secrets.WALLET_CONNECT_PROJECT_ID }}
        
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./frontend

  deploy-contracts:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd contracts
        npm ci
        
    - name: Deploy contracts
      run: |
        cd contracts
        npm run deploy:mumbai
      env:
        PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
        MUMBAI_RPC_URL: ${{ secrets.MUMBAI_RPC_URL }}
        POLYGONSCAN_API_KEY: ${{ secrets.POLYGONSCAN_API_KEY }}
```

## 📊 Monitoring & Analytics

### 1. Error Tracking

Add Sentry for error tracking:

```bash
npm install @sentry/nextjs
```

### 2. Analytics

Add Google Analytics or similar:

```bash
npm install gtag
```

### 3. Performance Monitoring

Use Vercel Analytics or similar tools for performance monitoring.

## 🔒 Security Considerations

### 1. Environment Variables

- Never commit `.env` files to version control
- Use different keys for development/staging/production
- Rotate keys regularly

### 2. Smart Contract Security

- Use established libraries (OpenZeppelin)
- Conduct security audits before mainnet deployment
- Implement upgrade mechanisms if needed

### 3. Frontend Security

- Validate all user inputs
- Use HTTPS in production
- Implement proper CORS policies

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check for TypeScript errors: `npm run lint`
   - Ensure all dependencies are installed
   - Verify environment variables are set

2. **Contract Deployment Issues**:
   - Verify RPC URLs are accessible
   - Check wallet has sufficient MATIC for gas
   - Ensure private key has correct format

3. **Frontend Connection Issues**:
   - Verify contract addresses are correct
   - Check network configuration
   - Ensure WalletConnect project ID is valid

### Debug Commands

```bash
# Check contract deployment
npx hardhat run scripts/deploy.ts --network mumbai --verbose

# Test frontend build locally
npm run build && npm run start

# Check for linting issues
npm run lint
```

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Hardhat Deployment Guide](https://hardhat.org/hardhat-runner/docs/guides/deploying)
- [Vercel Documentation](https://vercel.com/docs)
- [Polygon Network Documentation](https://docs.polygon.technology/)

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the GitHub issues
3. Join our Discord community
4. Contact the development team

---

**Happy Deploying! 🌱**
