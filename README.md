# EcoDAO 🌱

**Decentralized Community Governance for Environmental Action**

EcoDAO empowers local communities to democratically fund and manage sustainability initiatives through blockchain governance and token-based incentives.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/russell-henderson/ecodao)
[![Smart Contracts](https://img.shields.io/badge/contracts-deployed-blue)](https://polygonscan.com/)
[![Frontend](https://img.shields.io/badge/frontend-live-green)](https://ecodao.adaptechdesigns.com)
[![License](https://img.shields.io/badge/license-MIT-orange)](LICENSE)

---

## 🎯 Problem

Communities lack coordinated mechanisms to incentivize individual environmental actions and democratically allocate resources for sustainability projects. Traditional approaches suffer from:

- **Lack of transparency** in funding decisions
- **No rewards** for individual eco-actions  
- **Centralized decision-making** without community input
- **Limited engagement** in environmental initiatives

## 💡 Solution

EcoDAO creates a decentralized autonomous organization where:

- 🪙 **Residents earn governance tokens** for verified environmental actions
- 🗳️ **Community votes** on sustainability project funding using earned tokens
- 📊 **Transparent allocation** of resources through smart contracts
- 🎮 **Gamified engagement** encouraging continued participation

---

## 🏗️ Architecture

### **Dual-Workspace Structure**
```
ecodao/
├── contracts/          # Hardhat project with Solidity smart contracts
│   ├── contracts/      # Core smart contracts
│   ├── test/          # Comprehensive test suite  
│   ├── scripts/       # Deployment and utilities
│   └── typechain-types/ # Auto-generated TypeScript types
└── frontend/          # Next.js 15 React app with Web3 integration
    ├── src/app/       # Next.js App Router pages
    ├── src/components/ # Reusable UI components
    ├── src/lib/       # Web3 utilities and contracts
    └── public/        # Static assets
```

### **Smart Contract Ecosystem (Polygon)**

#### **Core Contracts**
- **🪙 GreenToken.sol** - ERC-20 governance token with voting extensions
- **🏆 ActionRewards.sol** - Token distribution for verified eco-actions  
- **🗳️ GreenGovernor.sol** - OpenZeppelin Governor for proposal voting
- **💰 CommunityTreasury.sol** - Automated funding of approved projects

#### **Governance Parameters**
- **Voting Delay**: 1 day (allows snapshot creation)
- **Voting Period**: 7 days (community participation window)
- **Proposal Threshold**: 100 tokens (spam prevention)
- **Quorum**: 10% of total supply (ensures legitimacy)

### **Frontend Stack**

- **⚛️ Next.js 15** with App Router and Turbopack
- **🎨 Tailwind CSS** with Shadcn/ui components
- **🌐 Web3 Integration**: wagmi/viem + RainbowKit
- **🗄️ State Management**: React Query for blockchain caching
- **📁 Storage**: IPFS for decentralized photo/document storage

---

## 🚀 Quick Start

### **Prerequisites**

- **Node.js 18+** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **MetaMask** or compatible Web3 wallet

### **Installation**

```bash
# Clone the repository
git clone https://github.com/russell-henderson/verdao.git
cd ecodao

# Install contract dependencies
cd contracts
npm install

# Install frontend dependencies  
cd ../frontend
npm install
```

### **Environment Setup**

#### **Contracts Environment**
```bash
# contracts/.env
AMOY_PRIVATE_KEY=your_private_key_here
AMOY_RPC=https://rpc-amoy.polygon.technology
POLYGONSCAN_API_KEY=your_polygonscan_api_key
```

#### **Frontend Environment**
```bash
# frontend/.env.local
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
NEXT_PUBLIC_IPFS_API_URL=https://ipfs.infura.io:5001
```

### **Development Workflow**

#### **Smart Contract Development**
```bash
cd contracts

# Compile contracts + generate TypeScript types
npm run compile

# Run comprehensive test suite (13 tests)
npm run test

# Generate gas usage report
npm run gas-report

# Deploy to Polygon Amoy testnet
npm run deploy:amoy

# Deploy to local Hardhat network
npm run deploy:local
```

#### **Frontend Development**  
```bash
cd frontend

# Start development server with Turbopack
npm run dev
# → http://localhost:3000

# Build for production
npm run build

# Start production server
npm start
```

---

## 🎮 How It Works

### **For Community Members**

1. **🔗 Connect Wallet** - Use MetaMask or WalletConnect
2. **📸 Submit Actions** - Photo verification for environmental actions
3. **🪙 Earn Tokens** - Receive EcoTokens after community verification
4. **🗳️ Vote on Proposals** - Use governance tokens for community decisions
5. **📊 Track Impact** - Monitor project progress and environmental outcomes

#### **Action Types & Rewards**
| Action Type | Reward | XP | Description |
|-------------|---------|----|-----------| 
| 🌱 Composting | 5 tokens | 50 XP | Turn organic waste into nutrients |
| 🚴 Cycling | 3 tokens | 30 XP | Sustainable transportation |
| ⚡ Energy Saving | 4 tokens | 40 XP | Reduce consumption |
| ♻️ Waste Reduction | 3 tokens | 30 XP | Minimize waste generation |
| 💧 Water Conservation | 2 tokens | 20 XP | Preserve water resources |
| 🔋 Renewable Energy | 10 tokens | 100 XP | Solar/wind installations |
| 🌳 Tree Planting | 8 tokens | 80 XP | Reforestation efforts |
| 🧹 Cleanup Events | 6 tokens | 60 XP | Community cleanup |
| 🚌 Sustainable Transport | 2 tokens | 20 XP | Public transit usage |
| ♻️ Recycling | 1 token | 10 XP | Proper waste sorting |

### **For Project Proposers**

1. **📝 Submit Proposal** - Funding requirements and timeline
2. **💬 Community Discussion** - Feedback and refinement period  
3. **🗳️ Token Holder Voting** - Democratic approval process
4. **💰 Automatic Funding** - Smart contract fund release
5. **📊 Progress Reporting** - Milestone-based transparency

---

## 🔧 Technology Stack

### **Blockchain Layer**
- **Solidity ^0.8.20** - Smart contract development
- **OpenZeppelin** - Battle-tested contract libraries
- **Hardhat** - Development environment and testing
- **Polygon Amoy** - Low-cost, fast transactions

### **Frontend Layer**
- **TypeScript** - Type safety throughout
- **Next.js 15** - React framework with App Router
- **Turbopack** - Ultra-fast bundler for development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - High-quality component library

### **Web3 Integration**
- **wagmi** - React hooks for Ethereum
- **viem** - TypeScript Ethereum library  
- **RainbowKit** - Wallet connection UI
- **React Query** - Blockchain state management

### **Storage & Infrastructure**
- **IPFS** - Decentralized file storage
- **Polygon** - Layer 2 scaling solution
- **Vercel** - Frontend deployment
- **GitHub Actions** - CI/CD pipeline

---

## 🧪 Testing

### **Smart Contract Tests**
```bash
cd contracts && npm test
```

**Test Coverage:**
- ✅ Token minting and governance voting
- ✅ Action submission and verification flow
- ✅ Community treasury and project funding
- ✅ Governance proposal creation and execution
- ✅ Access control and security measures

**Gas Usage Report:**
| Contract | Deployment | Key Functions |
|----------|------------|---------------|
| GreenToken | 2.9M gas | Transfer: 56k, Delegate: 95k |
| ActionRewards | 2.3M gas | Submit: 198k, Verify: 254k |
| GreenGovernor | 4.3M gas | Propose: 105k |
| CommunityTreasury | 2.8M gas | Create Project: 490k |

### **Frontend Testing**
```bash  
cd frontend && npm run build
# ✅ Builds successfully with TypeScript checks
# ✅ All contract integrations working
# ✅ IPFS integration functional
```

---

## 🚀 Deployment

### **Smart Contracts**

#### **Polygon Amoy Testnet**
```bash
cd contracts
npm run deploy:amoy
```
Contract addresses automatically updated in `frontend/src/lib/addresses.generated.ts`

#### **Local Development**
```bash
# Terminal 1: Start local blockchain
cd contracts && npx hardhat node

# Terminal 2: Deploy contracts
cd contracts && npm run deploy:local
```

### **Frontend**

#### **Development**
```bash
cd frontend && npm run dev
```

#### **Production (Vercel)**
```bash
cd frontend
npm run build
vercel --prod
```

---

## 🌍 Impact Metrics

Track EcoDAO's environmental impact:

- **🎯 Actions Completed** - Total verified eco-actions by community
- **🌱 Carbon Offset** - Estimated CO2 reduction from funded projects  
- **👥 Community Engagement** - Active voters and participants
- **💰 Projects Funded** - Successfully completed sustainability initiatives
- **🏆 Gamification** - XP earned, achievements unlocked, leaderboard rankings

---

## 🛣️ Roadmap

### **✅ Phase 1: Core Platform (Current)**
- Smart contract governance system
- Web3 frontend with wallet integration
- Action submission and community verification
- Proposal voting and treasury management

### **🔄 Phase 2: Enhanced Features**
- 📱 Progressive Web App (PWA) support
- 🤖 AI-powered action verification
- 📊 Advanced analytics dashboard
- 🔗 Cross-chain compatibility (Ethereum, BSC)

### **🚀 Phase 3: Ecosystem Expansion**
- 🏛️ Government partnership integrations
- 💱 Carbon credit marketplace
- 🌐 Multi-community federation
- 🏢 Corporate sustainability partnerships

### **🌟 Phase 4: Global Network**
- 🤝 Inter-DAO collaboration protocols
- 🎓 Educational platform integration
- 📈 Impact measurement & reporting APIs
- 🌍 Global environmental action network

---

## 🤝 Contributing

We welcome contributions from developers, environmentalists, and community organizers!

### **Development Setup**
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Follow the development workflow above
4. Ensure all tests pass: `npm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push branch: `git push origin feature/amazing-feature`
7. Open Pull Request

### **Areas for Contribution**
- 🔧 Smart contract optimizations
- 🎨 UI/UX improvements  
- 🧪 Additional test coverage
- 📚 Documentation enhancements
- 🌐 Internationalization (i18n)
- ♿ Accessibility improvements

---

## 📚 Documentation

- **📖 Architecture Guide**: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
- **🚀 Deployment Guide**: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)  
- **🎮 Gamification System**: [`docs/GAMIFICATION.md`](docs/GAMIFICATION.md)
- **🎨 Brand Guidelines**: [`docs/BRAND-GUIDELINES.md`](docs/BRAND-GUIDELINES.md)
- **🤖 AI Assistant Instructions**: [`.github/copilot-instructions.md`](.github/copilot-instructions.md)

---

## 🔒 Security

### **Smart Contract Security**
- OpenZeppelin security-audited libraries
- Comprehensive test coverage (13+ tests)
- Time-locked governance for safety
- Multi-signature treasury controls

### **Responsible Disclosure**
Found a security issue? Please email: **security@ecodao.org**

---

## 📄 License

This project is licensed under the **MIT License** - see [`LICENSE`](LICENSE) for details.

---

## 🙋‍♂️ Support & Community

- **🌐 Website**: [ecodao.adaptechdesigns.com](https://ecodao.adaptechdesigns.com)
- **📧 Email**: hello@ecodao.org
- **💬 Discord**: [Join our community](https://discord.gg/ecodao)
- **📱 Twitter**: [@EcoDAO_org](https://twitter.com/EcoDAO_org)
- **🐛 Issues**: [GitHub Issues](https://github.com/russell-henderson/verdao/issues)
- **📖 Discussions**: [GitHub Discussions](https://github.com/russell-henderson/verdao/discussions)

---

## 🏅 Acknowledgments

- **🏗️ Built with**: [OpenZeppelin](https://openzeppelin.com/), [Next.js](https://nextjs.org/), [Polygon](https://polygon.technology/)
- **🎨 Design**: [Tailwind CSS](https://tailwindcss.com/), [Shadcn/ui](https://ui.shadcn.com/)
- **🌐 Web3**: [wagmi](https://wagmi.sh/), [RainbowKit](https://www.rainbowkit.com/)
- **🚀 Deployment**: [Vercel](https://vercel.com/), [IPFS](https://ipfs.io/)

---

<div align="center">

**Building sustainable communities, one vote at a time.** 🌱✊

[**Get Started**](https://ecodao.adaptechdesigns.com) • [**View Contracts**](https://polygonscan.com/) • [**Join Discord**](https://discord.gg/ecodao)

</div>
4. **Automatic fund release** upon milestone completion
5. **Progress reporting** to maintain transparency

## 🏆 Key Features

- **Token-Based Governance**: Democratic decision-making weighted by contribution
- **Action Verification**: Community-driven validation of environmental actions
- **Transparent Funding**: All transactions recorded on blockchain
- **Impact Tracking**: Measurable outcomes for funded projects
- **Gamification**: Leaderboards and achievements for sustained engagement
- **Mobile Responsive**: Accessible across all devices

## 🔧 Technology Stack

**Blockchain:**

- Solidity smart contracts
- OpenZeppelin governance framework
- Polygon network (low fees, fast transactions)

**Frontend:**

- Next.js 13 with App Router
- Tailwind CSS for styling
- ethers.js for Web3 integration
- IPFS for decentralized storage

**Development Tools:**

- Hardhat for smart contract development
- Vercel for deployment
- GitHub Actions for CI/CD

## 🌍 Impact Metrics

Track EcoDAO's environmental impact:

- **Actions Completed**: Total verified eco-actions by community
- **Carbon Offset**: Estimated CO2 reduction from funded projects
- **Community Engagement**: Active voters and participants
- **Projects Funded**: Successfully completed sustainability initiatives

## 🛣️ Roadmap

### Phase 1 (Hackathon - Current)

- ✅ Core governance contracts
- ✅ Basic frontend interface
- ✅ Action submission and verification
- ✅ Proposal voting system

### Phase 2 (Post-Hackathon)

- 📱 Mobile app development
- 🔗 IoT device integration for automated action tracking
- 🌐 Multi-community support
- 📊 Advanced impact analytics

### Phase 3 (Future)

- 🤝 Partnership integrations with local governments
- 💱 Carbon credit marketplace integration
- 🔬 AI-powered impact verification
- 🌍 Global community network

## 🤝 Contributing

We welcome contributions from developers, environmentalists, and community organizers!

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- **Documentation**: [docs.EcoDAO.com](https://docs.EcoDAO.com)
- **Discord**: [Join our community](https://discord.gg/EcoDAO)
- **Email**: <hello@EcoDAO.com>
- **Issues**: GitHub Issues tab

## 🏅 Hackathon Submission

**Hack 4 Humanity 2025**

- **Team**: [Your Name]
- **Theme**: Blockchain for Sustainability
- **Demo**: [EcoDAO.adaptechdesigns.com](https://EcoDAO.adaptechdesigns.com)
- **Video**: [4-minute demo video link]

---

*Building sustainable communities, one vote at a time.* 🌱✊
