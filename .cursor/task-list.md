
# `task-list.md`

## 🌱 EcoDAO Phase 4 – QA, Deployment, and Submission Prep

### 1. **Smart Contract Deployment & Verification**

* [x] Deploy **EcoPoints**, **ProjectRegistry**, and **ChallengeRegistry** contracts to **Polygon Amoy testnet**
* [x] Update `.env` and frontend config with deployed addresses
* [ ] Verify contracts on **Polygonscan** using `hardhat-etherscan` plugin
* [ ] Ensure **constructor args** and metadata are properly published
* [x] Confirm ABI matches deployed contracts (regenerate if needed)

---

### 2. **Frontend Integration QA**

* [x] Replace placeholder contract addresses with deployed testnet addresses
* [ ] Run **end-to-end QA flow**:

  * [ ] Create new project → confirm stored in ProjectRegistry
  * [ ] Contribute ECO → check balance deduction + XP earned in EcoPoints
  * [ ] Join challenge → XP granted instantly and reflected on leaderboard
  * [ ] Verify leaderboard updates correctly with multiple accounts
  * [ ] Confirm event listeners update UI in real-time (funding progress, XP gain)
* [ ] Add **toast notifications** for success/failure of blockchain transactions
* [ ] Fix any async loading states (spinners, error handling for rejected txs)

---

### 3. **UI/UX Polish**

* [ ] Projects Page:

  * [ ] Show **funding progress bar** (% funded vs target)
  * [ ] Add **XP reward tooltip** when hovering over contribute button
* [ ] Challenges Page:

  * [ ] Show **joined status** (badge / highlight) for active user
  * [ ] Display **XP earned history** (joined challenges → XP log)
* [ ] Leaderboard:

  * [ ] Add **profile avatars (blockies/jazzicons)** next to addresses
  * [ ] Display **XP delta** (recent gains highlighted in green)
* [ ] Global:

  * [ ] Ensure mobile responsiveness for all pages
  * [ ] Standardize button styles (primary, secondary, disabled states)

---

### 4. **Bug Fixing & Testing**

* [ ] Write **frontend integration tests** (Playwright or Jest + wagmi mocks)

  * Project creation → stored in registry
  * Contribution → XP balance updated
  * Challenge join → XP awarded
  * Leaderboard → correct ranking order
* [ ] Run **manual QA with multiple test accounts** on Amoy
* [ ] Check for **edge cases**:

  * [ ] Contributing < 100 ECO (should round down XP)
  * [ ] Project fully funded → new contributions blocked
  * [ ] Attempting to re-join a challenge → rejected

---

### 5. **Hackathon Submission Prep**

* [ ] Record **demo video (3–4 min)**

  * [ ] Intro: problem → EcoDAO solution
  * [ ] Walkthrough: create project, contribute ECO, earn XP, join challenge, leaderboard
  * [ ] End with vision for scaling EcoDAO to neighborhoods
* [ ] Capture **high-quality screenshots** of:

  * Project creation modal + card with live funding
  * Contribution flow with XP rewards
  * Challenges page with joined state
  * Leaderboard with top contributors
* [ ] Update `README.md` with:

  * [ ] Verified contract addresses + Polygonscan links
  * [ ] Instructions for connecting to Amoy testnet
  * [ ] Demo screenshots + video link
  * [ ] Devpost submission details (repo link, deployed site link, problem/solution summary)

---

### 6. **Final Review**

* [ ] Run **end-to-end demo** live before submission
* [ ] Double-check `.env.example` and `.gitignore` hygiene
* [ ] Confirm **Vercel deployment** works with testnet contracts
* [ ] Ensure **docs, repo, and demo video** are in sync

