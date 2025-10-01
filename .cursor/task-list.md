# EcoDAO Tasklist – Phase 2: Final QA & Demo Prep

## 1. En## 7. Stretch / Bonus Enhancements
- [x] Add "Demo Mode" toggle:
  - [x] Preloaded mock wallet + sample proposals.
- [x] Add tooltip explanations:
  - [x] "What is a proposal?"  
  - [x] "How do rewards work?"
- [ ] If time permits: add a stubbed AI verification placeholder for future roadmap.d Testing (High Priority)
- [ ] Run full flow on deployed frontend + Polygon Amoy:
  - [ ] Connect wallet and fund with test MATIC.
  - [ ] Submit at least 3 different actions (TREE_PLANTING, CYCLING, COMPOSTING).
  - [ ] Verify token rewards are minted correctly.
  - [ ] Confirm governance proposals are created for each action.
  - [ ] Vote on proposals and ensure results update in UI.
- [ ] Record any transaction failures, gas anomalies, or UI misalignments.

---

## 2. Governance Integration QA
- [ ] Investigate why proposals are not always visible:
  - [ ] Check Governor contract events (`ProposalCreated`).
  - [ ] Confirm frontend is fetching proposals from correct contract address.
  - [ ] Ensure ABI matches deployed Governor contract.
  - [ ] Test voting lifecycle: Pending → Active → Succeeded/Defeated.
- [ ] Fix proposal → UI mapping logic so each submitted action is traceable in governance.

---

## 3. Contract Verification
- [ ] Retry contract verification on Polygonscan:
  - [ ] Ensure compiler version + optimizer settings match `hardhat.config.js`.
  - [ ] Use `npx hardhat verify` with correct constructor args.
  - [ ] If still blocked, use Polygonscan “flatten contract” + manual verify.
- [ ] Document verified contract links in README + frontend footer.

---

## 4. Frontend & UI Testing
- [ ] Validate on multiple browsers (Chrome, Brave, Edge).
- [ ] Test mobile responsiveness (small viewport for Action submission + Governance pages).
- [ ] Confirm transaction states (pending, success, fail) all render properly.
- [ ] Fix any broken styles or inconsistent layouts.

---

## 5. Demo Materials
- [ ] Capture demo screenshots:
  - [ ] Landing Page
  - [ ] Submit Action with uploaded proof
  - [ ] Governance proposal created from action
  - [ ] Voting results screen
- [ ] Prepare demo video:
  - [ ] Script: Problem → Solution → Live Demo → Roadmap
  - [ ] Record live action submission + governance voting
  - [ ] Add narration with EcoDAO tagline: *“The first neighborhood climate democracy.”*
- [ ] Bundle screenshots + video link for Devpost submission.

---

## 6. Critical Fixes Before Submission
- [ ] Resolve any contract/transaction blockers found in testing.
- [ ] Patch governor integration if proposals do not appear consistently.
- [ ] Double-check all contract addresses in `.env` and frontend config.

---

## 7. Stretch / Bonus Enhancements
- [ ] Add “Demo Mode” toggle:
  - [ ] Preloaded mock wallet + sample proposals.
- [ ] Add tooltip explanations:
  - [ ] “What is a proposal?”  
  - [ ] “How do rewards work?”
- [ ] If time permits: add a stubbed AI verification placeholder for future roadmap.

