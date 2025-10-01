import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer } from "ethers";
import {
  GreenToken,
  EcoPoints,
  ProjectRegistry,
  ChallengeRegistry
} from "../typechain-types";

describe("EcoDAO Phase 3: Projects, Contributions, and Challenges", function () {
  let greenToken: GreenToken;
  let ecoPoints: EcoPoints;
  let projectRegistry: ProjectRegistry;
  let challengeRegistry: ChallengeRegistry;
  
  let deployer: Signer;
  let user1: Signer;
  let user2: Signer;
  let treasury: Signer;
  
  let deployerAddress: string;
  let user1Address: string;
  let user2Address: string;
  let treasuryAddress: string;

  beforeEach(async function () {
    // Get signers
    [deployer, user1, user2, treasury] = await ethers.getSigners();
    deployerAddress = await deployer.getAddress();
    user1Address = await user1.getAddress();
    user2Address = await user2.getAddress();
    treasuryAddress = await treasury.getAddress();

    // Deploy GreenToken
    const GreenToken = await ethers.getContractFactory("GreenToken");
    greenToken = (await GreenToken.deploy("EcoToken", "ECO", deployerAddress)) as GreenToken;
    await greenToken.waitForDeployment();

    // Deploy EcoPoints
    const EcoPoints = await ethers.getContractFactory("EcoPoints");
    ecoPoints = (await EcoPoints.deploy("EcoPoints", "XP", deployerAddress)) as EcoPoints;
    await ecoPoints.waitForDeployment();

    // Deploy ProjectRegistry
    const ProjectRegistry = await ethers.getContractFactory("ProjectRegistry");
    projectRegistry = (await ProjectRegistry.deploy(
      await greenToken.getAddress(),
      await ecoPoints.getAddress(),
      deployerAddress
    )) as ProjectRegistry;
    await projectRegistry.waitForDeployment();

    // Deploy ChallengeRegistry
    const ChallengeRegistry = await ethers.getContractFactory("ChallengeRegistry");
    challengeRegistry = (await ChallengeRegistry.deploy(
      await ecoPoints.getAddress(),
      deployerAddress
    )) as ChallengeRegistry;
    await challengeRegistry.waitForDeployment();

    // Grant MINTER_ROLE to ProjectRegistry and ChallengeRegistry
    const MINTER_ROLE = await ecoPoints.MINTER_ROLE();
    await ecoPoints.grantRole(MINTER_ROLE, await projectRegistry.getAddress());
    await ecoPoints.grantRole(MINTER_ROLE, await challengeRegistry.getAddress());

    // Transfer some ECO tokens to users for testing
    const transferAmount = ethers.parseEther("10000"); // 10,000 ECO
    await greenToken.transfer(user1Address, transferAmount);
    await greenToken.transfer(user2Address, transferAmount);
  });

  describe("EcoPoints", function () {
    it("Should be non-transferable", async function () {
      // Mint some points to user1
      const MINTER_ROLE = await ecoPoints.MINTER_ROLE();
      await ecoPoints.grantRole(MINTER_ROLE, deployerAddress);
      await ecoPoints.mint(user1Address, ethers.parseEther("100"), "TEST");

      // Check balance
      expect(await ecoPoints.balanceOf(user1Address)).to.equal(ethers.parseEther("100"));

      // Try to transfer - should revert
      await expect(
        ecoPoints.connect(user1).transfer(user2Address, ethers.parseEther("50"))
      ).to.be.revertedWith("EcoPoints: tokens are non-transferable");

      // Try to approve - should revert
      await expect(
        ecoPoints.connect(user1).approve(user2Address, ethers.parseEther("50"))
      ).to.be.revertedWith("EcoPoints: tokens are non-transferable");
    });

    it("Should only allow minters to mint points", async function () {
      // User1 should not be able to mint
      await expect(
        ecoPoints.connect(user1).mint(user1Address, ethers.parseEther("100"), "TEST")
      ).to.be.reverted;

      // Grant minter role and try again
      const MINTER_ROLE = await ecoPoints.MINTER_ROLE();
      await ecoPoints.grantRole(MINTER_ROLE, user1Address);
      
      await expect(
        ecoPoints.connect(user1).mint(user1Address, ethers.parseEther("100"), "TEST")
      ).to.emit(ecoPoints, "PointsMinted");
    });
  });

  describe("ProjectRegistry", function () {
    it("Should create a project successfully", async function () {
      const projectTx = await projectRegistry.connect(user1).createProject(
        "Solar Panel Installation",
        "Install solar panels in rural communities",
        "ipfs://QmExample123",
        ethers.parseEther("50000") // 50,000 ECO goal
      );

      await expect(projectTx)
        .to.emit(projectRegistry, "ProjectCreated")
        .withArgs(0, user1Address, ethers.parseEther("50000"), "Solar Panel Installation", "ipfs://QmExample123");

      const project = await projectRegistry.getProject(0);
      expect(project.creator).to.equal(user1Address);
      expect(project.title).to.equal("Solar Panel Installation");
      expect(project.goal).to.equal(ethers.parseEther("50000"));
      expect(project.raised).to.equal(0);
      expect(project.status).to.equal(0); // Active
    });

    it("Should allow contributions and mint XP", async function () {
      // Create a project
      await projectRegistry.connect(user1).createProject(
        "Tree Planting",
        "Plant trees in deforested areas",
        "ipfs://QmExample456",
        ethers.parseEther("25000")
      );

      // User2 contributes 1000 ECO
      const contributionAmount = ethers.parseEther("1000");
      
      // First approve the ProjectRegistry to spend tokens
      await greenToken.connect(user2).approve(await projectRegistry.getAddress(), contributionAmount);

      // Then contribute
      const contributeTx = await projectRegistry.connect(user2).contribute(0, contributionAmount);

      // Check events
      await expect(contributeTx)
        .to.emit(projectRegistry, "ContributionReceived")
        .withArgs(0, user2Address, contributionAmount, contributionAmount);

      await expect(contributeTx)
        .to.emit(ecoPoints, "PointsMinted")
        .withArgs(user2Address, ethers.parseEther("10"), "CONTRIBUTION"); // 1000 ECO = 10 XP (rate: 100 ECO per 1 XP)

      // Check project raised amount
      const project = await projectRegistry.getProject(0);
      expect(project.raised).to.equal(contributionAmount);

      // Check user's XP balance
      expect(await ecoPoints.balanceOf(user2Address)).to.equal(ethers.parseEther("10"));
    });

    it("Should allow multiple contributions", async function () {
      // Create a project
      await projectRegistry.connect(user1).createProject(
        "Ocean Cleanup",
        "Remove plastic from ocean",
        "ipfs://QmExample789",
        ethers.parseEther("100000")
      );

      // User1 contributes 500 ECO
      const amount1 = ethers.parseEther("500");
      await greenToken.connect(user1).approve(await projectRegistry.getAddress(), amount1);
      await projectRegistry.connect(user1).contribute(0, amount1);

      // User2 contributes 1500 ECO
      const amount2 = ethers.parseEther("1500");
      await greenToken.connect(user2).approve(await projectRegistry.getAddress(), amount2);
      await projectRegistry.connect(user2).contribute(0, amount2);

      // Check total raised
      const project = await projectRegistry.getProject(0);
      expect(project.raised).to.equal(ethers.parseEther("2000"));

      // Check individual contributions
      expect(await projectRegistry.getContribution(0, user1Address)).to.equal(amount1);
      expect(await projectRegistry.getContribution(0, user2Address)).to.equal(amount2);

      // Check XP balances
      expect(await ecoPoints.balanceOf(user1Address)).to.equal(ethers.parseEther("5")); // 500 ECO = 5 XP
      expect(await ecoPoints.balanceOf(user2Address)).to.equal(ethers.parseEther("15")); // 1500 ECO = 15 XP
    });

    it("Should allow owner to mark project as completed", async function () {
      // Create and fund a project
      await projectRegistry.connect(user1).createProject(
        "Wind Farm",
        "Build wind turbines",
        "ipfs://QmExampleWind",
        ethers.parseEther("75000")
      );

      // Only owner can mark as completed
      await expect(
        projectRegistry.connect(user1).markCompleted(0)
      ).to.be.reverted;

      const markTx = await projectRegistry.connect(deployer).markCompleted(0);
      await expect(markTx)
        .to.emit(projectRegistry, "ProjectStatusChanged")
        .withArgs(0, 1); // Status: Completed

      const project = await projectRegistry.getProject(0);
      expect(project.status).to.equal(1); // Completed
    });
  });

  describe("ChallengeRegistry", function () {
    it("Should have initial demo challenges", async function () {
      const activeChallenges = await challengeRegistry.getActiveChallenges();
      expect(activeChallenges.length).to.equal(3);

      expect(activeChallenges[0].name).to.equal("Green Commute Day");
      expect(activeChallenges[0].xpReward).to.equal(ethers.parseEther("150"));

      expect(activeChallenges[1].name).to.equal("Energy Conservation");
      expect(activeChallenges[1].xpReward).to.equal(ethers.parseEther("200"));

      expect(activeChallenges[2].name).to.equal("Community Cleanup");
      expect(activeChallenges[2].xpReward).to.equal(ethers.parseEther("300"));
    });

    it("Should allow users to join challenges and earn XP", async function () {
      // User1 joins the first challenge (Green Commute Day - 150 XP)
      const joinTx = await challengeRegistry.connect(user1).join(0);

      await expect(joinTx)
        .to.emit(challengeRegistry, "ChallengeJoined")
        .withArgs(user1Address, 0, ethers.parseEther("150"));

      await expect(joinTx)
        .to.emit(ecoPoints, "PointsMinted")
        .withArgs(user1Address, ethers.parseEther("150"), "CHALLENGE");

      // Check user's XP balance
      expect(await ecoPoints.balanceOf(user1Address)).to.equal(ethers.parseEther("150"));

      // Check join status
      expect(await challengeRegistry.getUserJoinStatus(0, user1Address)).to.be.true;
      expect(await challengeRegistry.joinCount(0)).to.equal(1);
    });

    it("Should prevent users from joining the same challenge twice", async function () {
      // User1 joins challenge 0
      await challengeRegistry.connect(user1).join(0);

      // Try to join again - should revert
      await expect(
        challengeRegistry.connect(user1).join(0)
      ).to.be.revertedWith("ChallengeRegistry: already joined this challenge");
    });

    it("Should allow multiple users to join different challenges", async function () {
      // User1 joins challenge 0 (150 XP)
      await challengeRegistry.connect(user1).join(0);
      
      // User2 joins challenge 1 (200 XP)
      await challengeRegistry.connect(user2).join(1);
      
      // User1 joins challenge 2 (300 XP)
      await challengeRegistry.connect(user1).join(2);

      // Check XP balances
      expect(await ecoPoints.balanceOf(user1Address)).to.equal(ethers.parseEther("450")); // 150 + 300
      expect(await ecoPoints.balanceOf(user2Address)).to.equal(ethers.parseEther("200"));

      // Check join counts
      expect(await challengeRegistry.joinCount(0)).to.equal(1);
      expect(await challengeRegistry.joinCount(1)).to.equal(1);
      expect(await challengeRegistry.joinCount(2)).to.equal(1);
    });
  });

  describe("Integration: Projects + Challenges", function () {
    it("Should accumulate XP from both projects and challenges", async function () {
      // Create a project
      await projectRegistry.connect(user1).createProject(
        "Integrated Test Project",
        "Testing integration",
        "ipfs://QmIntegration",
        ethers.parseEther("10000")
      );

      // User2 contributes 500 ECO (earns 5 XP)
      await greenToken.connect(user2).approve(await projectRegistry.getAddress(), ethers.parseEther("500"));
      await projectRegistry.connect(user2).contribute(0, ethers.parseEther("500"));

      // User2 joins challenge 1 (earns 200 XP)
      await challengeRegistry.connect(user2).join(1);

      // Total XP should be 205 (5 + 200)
      expect(await ecoPoints.balanceOf(user2Address)).to.equal(ethers.parseEther("205"));
    });
  });

  describe("Gas Usage", function () {
    it("Should measure gas usage for typical operations", async function () {
      // Create project
      const createTx = await projectRegistry.connect(user1).createProject(
        "Gas Test Project",
        "Testing gas usage",
        "ipfs://QmGasTest",
        ethers.parseEther("50000")
      );
      const createReceipt = await createTx.wait();
      console.log("Create Project Gas:", createReceipt?.gasUsed?.toString());

      // Contribute to project
      await greenToken.connect(user2).approve(await projectRegistry.getAddress(), ethers.parseEther("1000"));
      const contributeTx = await projectRegistry.connect(user2).contribute(0, ethers.parseEther("1000"));
      const contributeReceipt = await contributeTx.wait();
      console.log("Contribute Gas:", contributeReceipt?.gasUsed?.toString());

      // Join challenge
      const joinTx = await challengeRegistry.connect(user2).join(0);
      const joinReceipt = await joinTx.wait();
      console.log("Join Challenge Gas:", joinReceipt?.gasUsed?.toString());
    });
  });
});