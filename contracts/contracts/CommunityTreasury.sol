// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./GreenToken.sol";

/**
 * @title CommunityTreasury
 * @dev Treasury contract for managing community project funding
 * @notice Handles project proposals, milestone tracking, and fund distribution
 */
contract CommunityTreasury is Ownable, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;
    
    // Enums
    enum ProjectStatus {
        PENDING,        // 0 - Waiting for approval
        APPROVED,       // 1 - Approved by governance
        ACTIVE,         // 2 - Currently receiving funds
        COMPLETED,      // 3 - All milestones completed
        CANCELLED,      // 4 - Project cancelled
        PAUSED          // 5 - Project temporarily paused
    }
    
    enum MilestoneStatus {
        PENDING,        // 0 - Not yet reached
        REACHED,        // 1 - Milestone achieved
        VERIFIED,       // 2 - Milestone verified and funds released
        FAILED          // 3 - Milestone failed
    }
    
    // Structs
    struct Project {
        uint256 projectId;
        address proposer;
        string title;
        string description;
        string ipfsHash; // IPFS hash for detailed proposal document
        uint256 totalFundingAmount;
        uint256 releasedAmount;
        ProjectStatus status;
        uint256[] milestones;
        uint256[] milestoneAmounts;
        uint256 creationTime;
        uint256 completionTime;
        address verifier;
    }
    
    struct Milestone {
        uint256 milestoneId;
        uint256 projectId;
        string description;
        uint256 amount;
        MilestoneStatus status;
        uint256 deadline;
        string verificationNote;
        address verifier;
    }
    
    // State variables
    Counters.Counter private _projectCounter;
    Counters.Counter private _milestoneCounter;
    
    GreenToken public immutable greenToken;
    
    // Mappings
    mapping(uint256 => Project) public projects;
    mapping(uint256 => Milestone) public milestones;
    mapping(address => uint256[]) public userProjects;
    mapping(address => bool) public authorizedVerifiers;
    
    // Constants
    uint256 public constant MIN_FUNDING_AMOUNT = 100 * 10**18; // 100 EcoTokens minimum
    uint256 public constant MAX_FUNDING_AMOUNT = 1000000 * 10**18; // 1M EcoTokens maximum
    uint256 public constant MULTISIG_THRESHOLD = 10000 * 10**18; // 10K EcoTokens requires multisig
    uint256 public constant MAX_MILESTONES = 10; // Maximum milestones per project
    
    // Events
    event ProjectCreated(
        uint256 indexed projectId,
        address indexed proposer,
        uint256 totalAmount
    );
    
    event ProjectApproved(uint256 indexed projectId, address indexed approver);
    event ProjectCancelled(uint256 indexed projectId, string reason);
    event ProjectCompleted(uint256 indexed projectId);
    
    event MilestoneCreated(
        uint256 indexed milestoneId,
        uint256 indexed projectId,
        string description,
        uint256 amount
    );
    
    event MilestoneReached(
        uint256 indexed milestoneId,
        uint256 indexed projectId,
        address indexed verifier
    );
    
    event FundsReleased(
        uint256 indexed projectId,
        uint256 indexed milestoneId,
        uint256 amount
    );
    
    event VerifierAdded(address indexed verifier);
    event VerifierRemoved(address indexed verifier);
    
    // Modifiers
    modifier onlyAuthorizedVerifier() {
        require(authorizedVerifiers[msg.sender], "CommunityTreasury: Not authorized verifier");
        _;
    }
    
    modifier validProject(uint256 projectId) {
        require(projects[projectId].proposer != address(0), "CommunityTreasury: Project does not exist");
        _;
    }
    
    modifier validMilestone(uint256 milestoneId) {
        require(milestones[milestoneId].projectId != 0 || milestones[milestoneId].amount != 0, "CommunityTreasury: Milestone does not exist");
        _;
    }
    
    constructor(address _greenToken) {
        greenToken = GreenToken(_greenToken);
        authorizedVerifiers[msg.sender] = true; // Owner is initially authorized
    }
    
    /**
     * @dev Create a new project proposal
     * @param title Project title
     * @param description Project description
     * @param ipfsHash IPFS hash of detailed proposal
     * @param milestoneDescriptions Array of milestone descriptions
     * @param milestoneAmounts Array of milestone funding amounts
     * @param milestoneDeadlines Array of milestone deadlines
     */
    function createProject(
        string calldata title,
        string calldata description,
        string calldata ipfsHash,
        string[] calldata milestoneDescriptions,
        uint256[] calldata milestoneAmounts,
        uint256[] calldata milestoneDeadlines
    ) external whenNotPaused nonReentrant {
        require(bytes(title).length > 0, "CommunityTreasury: Title required");
        require(bytes(description).length > 0, "CommunityTreasury: Description required");
        require(milestoneDescriptions.length > 0, "CommunityTreasury: At least one milestone required");
        require(milestoneDescriptions.length <= MAX_MILESTONES, "CommunityTreasury: Too many milestones");
        require(milestoneDescriptions.length == milestoneAmounts.length, "CommunityTreasury: Milestone arrays length mismatch");
        require(milestoneDescriptions.length == milestoneDeadlines.length, "CommunityTreasury: Milestone arrays length mismatch");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < milestoneAmounts.length; i++) {
            totalAmount += milestoneAmounts[i];
        }
        
        require(totalAmount >= MIN_FUNDING_AMOUNT, "CommunityTreasury: Funding too low");
        require(totalAmount <= MAX_FUNDING_AMOUNT, "CommunityTreasury: Funding too high");
        
        uint256 projectId = _projectCounter.current();
        _projectCounter.increment();
        
        _createProjectInternal(projectId, title, description, ipfsHash, totalAmount, milestoneAmounts);
        _createMilestonesInternal(projectId, milestoneDescriptions, milestoneAmounts, milestoneDeadlines);
        
        userProjects[msg.sender].push(projectId);
        
        emit ProjectCreated(projectId, msg.sender, totalAmount);
    }
    
    function _createProjectInternal(
        uint256 projectId,
        string calldata title,
        string calldata description,
        string calldata ipfsHash,
        uint256 totalAmount,
        uint256[] calldata milestoneAmounts
    ) internal {
        projects[projectId] = Project({
            projectId: projectId,
            proposer: msg.sender,
            title: title,
            description: description,
            ipfsHash: ipfsHash,
            totalFundingAmount: totalAmount,
            releasedAmount: 0,
            status: ProjectStatus.PENDING,
            milestones: new uint256[](0),
            milestoneAmounts: milestoneAmounts,
            creationTime: block.timestamp,
            completionTime: 0,
            verifier: address(0)
        });
    }
    
    function _createMilestonesInternal(
        uint256 projectId,
        string[] calldata milestoneDescriptions,
        uint256[] calldata milestoneAmounts,
        uint256[] calldata milestoneDeadlines
    ) internal {
        for (uint256 i = 0; i < milestoneDescriptions.length; i++) {
            uint256 milestoneId = _milestoneCounter.current();
            _milestoneCounter.increment();
            
            milestones[milestoneId] = Milestone({
                milestoneId: milestoneId,
                projectId: projectId,
                description: milestoneDescriptions[i],
                amount: milestoneAmounts[i],
                status: MilestoneStatus.PENDING,
                deadline: milestoneDeadlines[i],
                verificationNote: "",
                verifier: address(0)
            });
            
            projects[projectId].milestones.push(milestoneId);
        }
    }
    
    /**
     * @dev Approve a project (only by owner or governance)
     * @param projectId The project ID to approve
     */
    function approveProject(uint256 projectId)
        external
        onlyOwner
        validProject(projectId)
        whenNotPaused
    {
        Project storage project = projects[projectId];
        require(project.status == ProjectStatus.PENDING, "CommunityTreasury: Project not pending");
        
        project.status = ProjectStatus.APPROVED;
        
        emit ProjectApproved(projectId, msg.sender);
    }
    
    /**
     * @dev Mark a milestone as reached
     * @param milestoneId The milestone ID
     * @param verificationNote Note about the milestone achievement
     */
    function markMilestoneReached(
        uint256 milestoneId,
        string calldata verificationNote
    ) external onlyAuthorizedVerifier validMilestone(milestoneId) whenNotPaused {
        Milestone storage milestone = milestones[milestoneId];
        Project storage project = projects[milestone.projectId];
        
        require(project.status == ProjectStatus.APPROVED || project.status == ProjectStatus.ACTIVE, 
                "CommunityTreasury: Project not approved");
        require(milestone.status == MilestoneStatus.PENDING, "CommunityTreasury: Milestone already processed");
        require(block.timestamp <= milestone.deadline, "CommunityTreasury: Milestone deadline passed");
        
        milestone.status = MilestoneStatus.REACHED;
        milestone.verificationNote = verificationNote;
        milestone.verifier = msg.sender;
        
        if (project.status == ProjectStatus.APPROVED) {
            project.status = ProjectStatus.ACTIVE;
        }
        
        emit MilestoneReached(milestoneId, milestone.projectId, msg.sender);
    }
    
    /**
     * @dev Release funds for a verified milestone
     * @param milestoneId The milestone ID
     */
    function releaseMilestoneFunds(uint256 milestoneId)
        external
        onlyOwner
        validMilestone(milestoneId)
        whenNotPaused
        nonReentrant
    {
        Milestone storage milestone = milestones[milestoneId];
        Project storage project = projects[milestone.projectId];
        
        require(milestone.status == MilestoneStatus.REACHED, "CommunityTreasury: Milestone not reached");
        require(project.status == ProjectStatus.ACTIVE, "CommunityTreasury: Project not active");
        require(greenToken.balanceOf(address(this)) >= milestone.amount, "CommunityTreasury: Insufficient funds");
        
        milestone.status = MilestoneStatus.VERIFIED;
        project.releasedAmount += milestone.amount;
        
        // Transfer funds to project proposer
        greenToken.transfer(project.proposer, milestone.amount);
        
        // Check if all milestones are completed
        bool allCompleted = true;
        for (uint256 i = 0; i < project.milestones.length; i++) {
            if (milestones[project.milestones[i]].status != MilestoneStatus.VERIFIED) {
                allCompleted = false;
                break;
            }
        }
        
        if (allCompleted) {
            project.status = ProjectStatus.COMPLETED;
            project.completionTime = block.timestamp;
            emit ProjectCompleted(milestone.projectId);
        }
        
        emit FundsReleased(milestone.projectId, milestoneId, milestone.amount);
    }
    
    /**
     * @dev Cancel a project
     * @param projectId The project ID to cancel
     * @param reason Reason for cancellation
     */
    function cancelProject(uint256 projectId, string calldata reason)
        external
        onlyOwner
        validProject(projectId)
        whenNotPaused
    {
        Project storage project = projects[projectId];
        require(project.status != ProjectStatus.COMPLETED, "CommunityTreasury: Cannot cancel completed project");
        require(project.status != ProjectStatus.CANCELLED, "CommunityTreasury: Project already cancelled");
        
        project.status = ProjectStatus.CANCELLED;
        
        emit ProjectCancelled(projectId, reason);
    }
    
    /**
     * @dev Add an authorized verifier
     * @param verifier Address of the verifier
     */
    function addVerifier(address verifier) external onlyOwner {
        require(verifier != address(0), "CommunityTreasury: Invalid verifier address");
        authorizedVerifiers[verifier] = true;
        emit VerifierAdded(verifier);
    }
    
    /**
     * @dev Remove an authorized verifier
     * @param verifier Address of the verifier
     */
    function removeVerifier(address verifier) external onlyOwner {
        require(verifier != address(0), "CommunityTreasury: Invalid verifier address");
        authorizedVerifiers[verifier] = false;
        emit VerifierRemoved(verifier);
    }
    
    /**
     * @dev Deposit funds to treasury
     * @param amount Amount of EcoTokens to deposit
     */
    function depositFunds(uint256 amount) external whenNotPaused nonReentrant {
        require(amount > 0, "CommunityTreasury: Amount must be greater than zero");
        require(greenToken.transferFrom(msg.sender, address(this), amount), "CommunityTreasury: Transfer failed");
    }
    
    /**
     * @dev Pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Get project details
     * @param projectId The project ID
     * @return Project struct
     */
    function getProject(uint256 projectId) external view returns (Project memory) {
        return projects[projectId];
    }
    
    /**
     * @dev Get milestone details
     * @param milestoneId The milestone ID
     * @return Milestone struct
     */
    function getMilestone(uint256 milestoneId) external view returns (Milestone memory) {
        return milestones[milestoneId];
    }
    
    /**
     * @dev Get user's projects
     * @param user Address of the user
     * @return Array of project IDs
     */
    function getUserProjects(address user) external view returns (uint256[] memory) {
        return userProjects[user];
    }
    
    /**
     * @dev Get treasury balance
     * @return Balance of EcoTokens in treasury
     */
    function getTreasuryBalance() external view returns (uint256) {
        return greenToken.balanceOf(address(this));
    }
    
    /**
     * @dev Get total projects count
     * @return Total number of projects
     */
    function getTotalProjects() external view returns (uint256) {
        return _projectCounter.current();
    }
}
