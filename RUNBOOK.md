Perfect — here’s a **complete and comprehensive `RUNBOOK.md`** you can drop at the root of your EcoDAO repo. It is written for hackathon judges, teammates, and developers to **set up, deploy, run, and demo** the project end-to-end.

---

**BEGIN_FILE: RUNBOOK.md**

````markdown
# EcoDAO – RUNBOOK

## Overview
EcoDAO is a community-powered climate action DAO built for **Hack 4 Humanity 2025**.  
It connects **individual eco-actions** (like composting, cycling, or conserving energy) with **governance tokens** and **blockchain-based voting**.  
Residents earn tokens for verified eco-actions and use them to vote on how community funds are spent (solar, gardens, EV charging stations, etc).

This runbook provides a **step-by-step guide** to install, deploy, run, and demo EcoDAO.

---

## 1. Prerequisites

- **Node.js**: v18+  
- **npm**: v9+  
- **Hardhat** (installed via npm)  
- **Metamask or WalletConnect wallet** with Polygon Amoy test POL  
- **Vercel account** (for deployment)  

Install deps globally (optional):

```bash
npm install -g hardhat
````

---

## 2. Repository Structure

```
.
├── contracts/           # Hardhat smart contracts
│   ├── contracts/       # Solidity contracts
│   ├── scripts/         # Deployment scripts
│   ├── test/            # Contract tests
│   └── hardhat.config.ts
│
├── frontend/            # Next.js + RainbowKit + wagmi dApp
│   ├── src/lib/         # Web3 config, contracts, actions
│   └── pages/           # UI routes (Dashboard, Governance, Actions)
│
├── docs/                # Design docs, PRD, architecture, brand guidelines
└── RUNBOOK.md           # This file
```

---

## 3. Environment Setup

### Backend (`contracts/`)

1. Copy environment template:

   ```bash
   cd contracts
   cp .env.example .env
   ```

2. Fill in `.env`:

   ```
   AMOY_RPC=https://rpc-amoy.polygon.technology
   AMOY_PRIVATE_KEY=0x<your_private_key_with_test_POL>
   ```

   ⚠️ Use a **throwaway wallet** funded with test POL.

3. Install dependencies:

   ```bash
   npm install
   ```

---

### Frontend (`frontend/`)

1. Copy environment template:

   ```bash
   cd ../frontend
   cp .env.example .env.local
   ```

2. Fill in `.env.local`:

   ```
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_walletconnect_id
   NEXT_PUBLIC_IPFS_API_URL=https://ipfs.infura.io:5001
   NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
   NEXT_PUBLIC_IPFS_AUTH=your_auth_string
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

---

## 4. Contract Deployment

From the `contracts/` directory:

```bash
# Compile contracts
npx hardhat compile

# Deploy to Polygon Amoy
npx hardhat run scripts/deploy.ts --network amoy
```

This script will:

* Deploy **GreenToken**, **GreenGovernor**, **CommunityTreasury**, **ActionRewards**
* Seed the Treasury with some test POL
* Write `frontend/src/lib/addresses.generated.ts` with deployed addresses

---

## 5. Running the Frontend

From the `frontend/` directory:

```bash
npm run dev
```

Open: [http://localhost:3000](http://localhost:3000)

The dApp is now connected to the **Amoy testnet** using the deployed contract addresses.

---

## 6. Demo Flow (Hackathon Judges)

### Step 1: Connect Wallet

* Use WalletConnect or MetaMask set to **Polygon Amoy**.
* Ensure wallet has a small amount of test POL (get from Amoy faucet).

### Step 2: Reward an Eco Action

* Go to **Actions page**.
* Upload a mock composting/cycling photo (stored on IPFS).
* A verifier account triggers the `ActionRewards.reward()` function.
* User receives `EGT` governance tokens.

### Step 3: Delegate Votes

* In the **Dashboard**, click “Delegate Votes to Self.”
* This ensures your tokens count for governance.

### Step 4: Create a Proposal

* Navigate to **Governance**.
* Click “New Proposal.”
* Example: “Transfer 0.1 POL from Treasury to my wallet.”
* This calls `Governor.propose()`.

### Step 5: Vote

* During voting period, wallet holders cast votes: **For**, **Against**, **Abstain**.
* Voting state updates in the UI.

### Step 6: Execute Proposal

* Once voting succeeds, click **Execute**.
* This triggers `Governor.execute()` to call Treasury.
* Funds are transferred on-chain.

✅ Show Polygonscan transaction link for proof.

---

## 7. Deployment to Vercel

From `frontend/`:

```bash
vercel
```

In Vercel dashboard:

* Set the same environment variables as `.env.local`
* Confirm build succeeds
* Share the live URL in your Devpost submission

---

## 8. Devpost Submission Steps

1. **GitHub Repo**

   * Push `contracts/`, `frontend/`, `docs/`, and `RUNBOOK.md`.
   * Ensure `.env.local` is **not committed**.

2. **Demo Video (max 4 minutes)**

   * Record with Loom/OBS.
   * Flow:

     * Connect wallet
     * Reward action → earn tokens
     * Create proposal → vote → execute
     * Show Polygonscan explorer link

3. **Submit** at [hackhumanity2025.devpost.com](https://hackhumanity2025.devpost.com/)

   * Title: **EcoDAO – Neighborhood Climate Democracy**
   * Tagline: *Your eco-actions, your vote, your planet.*
   * Links: GitHub repo, Vercel demo, YouTube video.
   * Include screenshots of governance UI.

---

## 9. Troubleshooting

* **Gas errors**: Ensure wallet has test POL from Amoy faucet.
* **Proposal not executable**: Wait until voting deadline passes.
* **Addresses missing**: Rerun `npx hardhat run scripts/deploy.ts --network amoy`.

---

## 10. Next Steps (Post-Hackathon)

* Add AI-based eco-action verification (photo recognition).
* Expand proposals to real community projects.
* Explore municipal partnerships for pilot deployment.

---

## Contact

Maintainers: EcoDAO Hackathon Team
Hackathon: [Hack 4 Humanity 2025](https://hackhumanity2025.devpost.com/)

```
**END_FILE**  

---

This `RUNBOOK.md` will:  
- Guide **judges** step by step through the demo flow.  
- Guide **developers** through local setup and contract deployment.  
- Ensure your repo is **submission-ready**.  

Do you want me to also prepare the **README.md** (shorter, investor-facing, with quick links and screenshots) that pairs with this runbook?
```
