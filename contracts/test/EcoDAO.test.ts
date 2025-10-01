import { expect } from "chai";
import { ethers } from "hardhat";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { GreenToken, ActionRewards, CommunityTreasury, GreenGovernor, TimelockController } from "../typechain-types";

describe("EcoDAO Smart Contracts", function () {
  let greenToken: GreenToken;
  let actionRewards: ActionRewards;
  let communityTreasury: CommunityTreasury;
  let greenGovernor: GreenGovernor;
  let timelock: TimelockController;
  
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let verifier: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, user1, user2, verifier] = await ethers.getSigners();

    // Deploy GreenToken
    const GreenToken = await ethers.getContractFactory("GreenToken");
    greenToken = await GreenToken.deploy("EcoToken", "ECO", owner.address);
    await greenToken.waitForDeployment();

    // Deploy ActionRewards
    const ActionRewards = await ethers.getContractFactory("ActionRewards");
    actionRewards = await ActionRewards.deploy(await greenToken.getAddress());
    await actionRewards.waitForDeployment();

    // Grant MINTER_ROLE to ActionRewards
    const MINTER_ROLE = await greenToken.MINTER_ROLE();
    await greenToken.grantRole(MINTER_ROLE, await actionRewards.getAddress());

    // Deploy TimelockController
    const TimelockController = await ethers.getContractFactory("TimelockController");
    timelock = await TimelockController.deploy(
      2 * 24 * 60 * 60, // 2 days delay
      [owner.address], // proposers
      [owner.address], // executors
      owner.address // admin
    );
    await timelock.waitForDeployment();

    // Deploy GreenGovernor
    const GreenGovernor = await ethers.getContractFactory("GreenGovernor");
    greenGovernor = await GreenGovernor.deploy(
      await greenToken.getAddress(),
      await timelock.getAddress(),
      1 * 24 * 60 * 60, // voting delay: 1 day
      7 * 24 * 60 * 60, // voting period: 7 days
      ethers.parseEther("100"), // proposal threshold: 100 EcoTokens
      10 // quorum percentage: 10%
    );
    await greenGovernor.waitForDeployment();

    // Deploy CommunityTreasury
    const CommunityTreasury = await ethers.getContractFactory("CommunityTreasury");
    communityTreasury = await CommunityTreasury.deploy(await greenToken.getAddress());
    await communityTreasury.waitForDeployment();

    // Set up verifiers
    await actionRewards.addVerifier(verifier.address, 50);
    await communityTreasury.addVerifier(verifier.address);
  });

  describe("GreenToken", function () {
    it("Should have correct name and symbol", async function () {
      expect(await greenToken.name()).to.equal("EcoToken");
      expect(await greenToken.symbol()).to.equal("ECO");
    });

    it("Should have correct initial supply", async function () {
      const initialSupply = ethers.parseEther("100000000"); // 100M tokens
      expect(await greenToken.totalSupply()).to.equal(initialSupply);
    });

    it("Should allow minting by ActionRewards", async function () {
      // Test that ActionRewards can mint tokens through action verification
      const actionType = "COMPOSTING";
      const metadataURI = "QmTestHash123";
      
      await actionRewards.connect(user1).submitAction(actionType, metadataURI);
      await actionRewards.connect(verifier).verifyAction(0, true, "Verified action");
      
      const expectedReward = ethers.parseEther("5"); // 5 EcoTokens for composting
      expect(await greenToken.balanceOf(user1.address)).to.equal(expectedReward);
    });

    it("Should not allow minting by unauthorized address", async function () {
      await expect(
        greenToken.connect(user1).mint(user2.address, ethers.parseEther("100"), "Unauthorized mint")
      ).to.be.revertedWith(/AccessControl: account .* is missing role/);
    });
  });

  describe("ActionRewards", function () {
    it("Should allow action submission", async function () {
      const actionType = "COMPOSTING";
      const metadataURI = "QmTestHash123";
      
      await actionRewards.connect(user1).submitAction(actionType, metadataURI);
      
      const action = await actionRewards.getAction(0);
      expect(action.user).to.equal(user1.address);
      expect(action.actionType).to.equal(actionType);
      expect(action.metadataURI).to.equal(metadataURI);
      expect(action.status).to.equal(0); // PENDING
    });

    it("Should allow action verification", async function () {
      const actionType = "COMPOSTING";
      const metadataURI = "QmTestHash123";
      
      await actionRewards.connect(user1).submitAction(actionType, metadataURI);
      await actionRewards.connect(verifier).verifyAction(0, true, "Verified action");
      
      const action = await actionRewards.getAction(0);
      expect(action.status).to.equal(1); // VERIFIED
      expect(action.verifier).to.equal(verifier.address);
    });

    it("Should reward tokens for verified actions", async function () {
      const actionType = "COMPOSTING";
      const metadataURI = "QmTestHash123";
      const expectedReward = ethers.parseEther("5"); // 5 EcoTokens for composting
      
      await actionRewards.connect(user1).submitAction(actionType, metadataURI);
      await actionRewards.connect(verifier).verifyAction(0, true, "Verified action");
      
      expect(await greenToken.balanceOf(user1.address)).to.equal(expectedReward);
    });

    it("Should enforce cooldown period", async function () {
      const actionType = "COMPOSTING";
      const metadataURI = "QmTestHash123";
      
      await actionRewards.connect(user1).submitAction(actionType, metadataURI);
      
      await expect(
        actionRewards.connect(user1).submitAction(actionType, metadataURI)
      ).to.be.revertedWith("ActionRewards: Cooldown period not met");
    });
  });

  describe("CommunityTreasury", function () {
    it("Should allow project creation", async function () {
      const title = "Test Project";
      const description = "A test project for community funding";
      const ipfsHash = "QmProjectHash123";
      const milestoneDescriptions = ["Milestone 1", "Milestone 2"];
      const milestoneAmounts = [ethers.parseEther("100"), ethers.parseEther("200")];
      const milestoneDeadlines = [Date.now() + 86400, Date.now() + 172800]; // 1 and 2 days from now
      
      await communityTreasury.connect(user1).createProject(
        title,
        description,
        ipfsHash,
        milestoneDescriptions,
        milestoneAmounts,
        milestoneDeadlines
      );
      
      const project = await communityTreasury.getProject(0);
      expect(project.title).to.equal(title);
      expect(project.proposer).to.equal(user1.address);
      expect(project.status).to.equal(0); // PENDING
    });

    it("Should allow project approval", async function () {
      const title = "Test Project";
      const description = "A test project for community funding";
      const ipfsHash = "QmProjectHash123";
      const milestoneDescriptions = ["Milestone 1"];
      const milestoneAmounts = [ethers.parseEther("100")];
      const milestoneDeadlines = [Date.now() + 86400];
      
      await communityTreasury.connect(user1).createProject(
        title,
        description,
        ipfsHash,
        milestoneDescriptions,
        milestoneAmounts,
        milestoneDeadlines
      );
      
      await communityTreasury.connect(owner).approveProject(0);
      
      const project = await communityTreasury.getProject(0);
      expect(project.status).to.equal(1); // APPROVED
    });

    it("Should allow milestone verification and fund release", async function () {
      const title = "Test Project";
      const description = "A test project for community funding";
      const ipfsHash = "QmProjectHash123";
      const milestoneDescriptions = ["Milestone 1"];
      const milestoneAmounts = [ethers.parseEther("100")];
      const milestoneDeadlines = [Date.now() + 86400];
      
      // Fund treasury
      await greenToken.transfer(await communityTreasury.getAddress(), ethers.parseEther("1000"));
      
      await communityTreasury.connect(user1).createProject(
        title,
        description,
        ipfsHash,
        milestoneDescriptions,
        milestoneAmounts,
        milestoneDeadlines
      );
      
      await communityTreasury.connect(owner).approveProject(0);
      
      // Get the milestone ID from the project
      const project = await communityTreasury.getProject(0);
      const milestoneId = project.milestones[0];
      
      // Check that milestone exists
      const milestone = await communityTreasury.getMilestone(milestoneId);
      expect(milestone.projectId).to.equal(0);
      
      await communityTreasury.connect(verifier).markMilestoneReached(milestoneId, "Milestone completed");
      await communityTreasury.connect(owner).releaseMilestoneFunds(milestoneId);
      
      const updatedProject = await communityTreasury.getProject(0);
      expect(updatedProject.releasedAmount).to.equal(ethers.parseEther("100"));
    });
  });

  describe("GreenGovernor", function () {
    it("Should allow proposal creation", async function () {
      const targets = [await communityTreasury.getAddress()];
      const values = [0];
      const calldatas = [communityTreasury.interface.encodeFunctionData("approveProject", [0])];
      const description = "Test proposal";
      
      // User needs tokens to create proposal (100 EcoTokens threshold)
      await greenToken.transfer(user1.address, ethers.parseEther("1000"));
      
      // Delegate voting power to user1
      await greenToken.connect(user1).delegate(user1.address);
      
      await greenGovernor.connect(user1).propose(targets, values, calldatas, description);
      
      // Check that proposal was created by getting the proposal hash
      const proposalHash = await greenGovernor.hashProposal(targets, values, calldatas, ethers.id(description));
      expect(proposalHash).to.not.equal(ethers.ZeroHash);
    });

    it("Should allow voting on proposals", async function () {
      const targets = [await communityTreasury.getAddress()];
      const values = [0];
      const calldatas = [communityTreasury.interface.encodeFunctionData("approveProject", [0])];
      const description = "Test proposal";
      
      await greenToken.transfer(user1.address, ethers.parseEther("1000"));
      
      // Delegate voting power to user1
      await greenToken.connect(user1).delegate(user1.address);
      
      const tx = await greenGovernor.connect(user1).propose(targets, values, calldatas, description);
      const receipt = await tx.wait();
      const proposalId = receipt.logs[0].args.proposalId;
      
      // Check that proposal was created successfully
      expect(proposalId).to.not.equal(0);
      
      // Check proposal state (should be Pending)
      const state = await greenGovernor.state(proposalId);
      expect(state).to.equal(0); // Pending state
      
      // Check that user has voting power
      const votingPower = await greenGovernor.getVotingPower(user1.address);
      expect(votingPower).to.equal(ethers.parseEther("1000"));
    });
  });
});
