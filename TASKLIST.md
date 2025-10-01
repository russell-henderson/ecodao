# EcoDAO – Pre-Submission Checklist

Use this list to verify the repo is ready for Hack 4 Humanity 2025 submission.

---

## ✅ Project Structure

- [ ] `/contracts` contains:
  - GreenToken.sol, GreenGovernor.sol, CommunityTreasury.sol, ActionRewards.sol
  - `hardhat.config.ts` updated for Polygon Amoy (chainId 80002)
  - `scripts/deploy.ts` writes `../frontend/src/lib/addresses.generated.ts`
- [ ] `/frontend` contains:
  - `src/lib/web3.ts` configured for Polygon Amoy
  - `src/lib/contracts.ts` imports `addresses.generated.ts`
  - Helpers in `src/lib/governanceActions.ts` and `src/lib/rewardAction.ts`
- [ ] `/docs` folder present with PRD, story, branding
- [ ] `RUNBOOK.md` present and accurate
- [ ] `README.md` concise and pitch-style
- [ ] `TASKLIST.md` (this file) exists

---

## 🔐 Environment & Security

- [ ] `.env.example` exists in `/contracts` and `/frontend`
- [ ] `.env` and `.env.local` are **git-ignored**
- [ ] `AMOY_PRIVATE_KEY` points to a throwaway wallet with test POL
- [ ] `AMOY_RPC=https://rpc-amoy.polygon.technology` set

---

## ⚙️ Backend (Contracts)

- [ ] Contracts compile cleanly: `npx hardhat compile`
- [ ] Deployment works:  

  ```bash
  npx hardhat run scripts/deploy.ts --network amoy
