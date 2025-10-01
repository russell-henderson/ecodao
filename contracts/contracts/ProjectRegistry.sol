// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./EcoPoints.sol";

/**
 * @title ProjectRegistry
 * @dev Escrow contract for ECO token contributions to environmental projects
 * @notice Users can create projects and contribute ECO tokens to earn XP points
 */
contract ProjectRegistry is Ownable, Pausable, ReentrancyGuard {
    // Project status enum
    enum ProjectStatus { Active, Completed, Cancelled }
    
    // Project structure
    struct Project {
        uint256 id;
        address creator;
        string title;
        string description;
        string metadataURI;
        uint256 goal;
        uint256 raised;
        ProjectStatus status;
        uint256 createdAt;
    }
    
    // State variables
    IERC20 public immutable ecoToken;
    EcoPoints public immutable points;
    
    mapping(uint256 => Project) public projects;
    mapping(uint256 => mapping(address => uint256)) public contributions; // projectId => contributor => amount
    uint256 public projectCount;
    
    // XP conversion rate: 1 XP per 100 ECO tokens (adjustable)
    uint256 public xpPerEcoRate = 100; // 100 ECO = 1 XP
    
    // Events
    event ProjectCreated(
        uint256 indexed id,
        address indexed creator,
        uint256 goal,
        string title,
        string metadataURI
    );
    
    event ContributionReceived(
        uint256 indexed id,
        address indexed contributor,
        uint256 amount,
        uint256 newRaised
    );
    
    event ProjectStatusChanged(uint256 indexed id, ProjectStatus status);
    
    event XPRateUpdated(uint256 oldRate, uint256 newRate);
    
    constructor(
        address _ecoToken,
        address _points,
        address admin
    ) {
        require(_ecoToken != address(0), "ProjectRegistry: ECO token address cannot be zero");
        require(_points != address(0), "ProjectRegistry: Points address cannot be zero");
        
        ecoToken = IERC20(_ecoToken);
        points = EcoPoints(_points);
        _transferOwnership(admin);
    }
    
    /**
     * @dev Create a new environmental project
     * @param title Project title
     * @param description Project description
     * @param metadataURI IPFS URI for additional project metadata
     * @param goal Funding goal in ECO tokens
     * @return projectId The ID of the created project
     */
    function createProject(
        string memory title,
        string memory description,
        string memory metadataURI,
        uint256 goal
    ) external whenNotPaused returns (uint256 projectId) {
        require(bytes(title).length > 0, "ProjectRegistry: title cannot be empty");
        require(goal > 0, "ProjectRegistry: goal must be positive");
        
        projectId = projectCount++;
        
        projects[projectId] = Project({
            id: projectId,
            creator: msg.sender,
            title: title,
            description: description,
            metadataURI: metadataURI,
            goal: goal,
            raised: 0,
            status: ProjectStatus.Active,
            createdAt: block.timestamp
        });
        
        emit ProjectCreated(projectId, msg.sender, goal, title, metadataURI);
    }
    
    /**
     * @dev Contribute ECO tokens to a project and earn XP points
     * @param projectId ID of the project to contribute to
     * @param amount Amount of ECO tokens to contribute
     */
    function contribute(uint256 projectId, uint256 amount) external whenNotPaused nonReentrant {
        require(projectId < projectCount, "ProjectRegistry: project does not exist");
        require(amount > 0, "ProjectRegistry: contribution must be positive");
        
        Project storage project = projects[projectId];
        require(project.status == ProjectStatus.Active, "ProjectRegistry: project not active");
        
        // Transfer ECO tokens from contributor to this contract
        require(
            ecoToken.transferFrom(msg.sender, address(this), amount),
            "ProjectRegistry: ECO transfer failed"
        );
        
        // Update project and contribution tracking
        project.raised += amount;
        contributions[projectId][msg.sender] += amount;
        
        // Calculate and mint XP points (1 XP per 100 ECO tokens)
        uint256 xpAmount = amount / xpPerEcoRate;
        if (xpAmount > 0) {
            points.mint(msg.sender, xpAmount, "CONTRIBUTION");
        }
        
        emit ContributionReceived(projectId, msg.sender, amount, project.raised);
    }
    
    /**
     * @dev Mark a project as completed (only owner)
     * @param projectId ID of the project to mark as completed
     */
    function markCompleted(uint256 projectId) external onlyOwner {
        require(projectId < projectCount, "ProjectRegistry: project does not exist");
        
        Project storage project = projects[projectId];
        require(project.status == ProjectStatus.Active, "ProjectRegistry: project not active");
        
        project.status = ProjectStatus.Completed;
        emit ProjectStatusChanged(projectId, ProjectStatus.Completed);
    }
    
    /**
     * @dev Mark a project as cancelled (only owner)
     * @param projectId ID of the project to mark as cancelled
     */
    function markCancelled(uint256 projectId) external onlyOwner {
        require(projectId < projectCount, "ProjectRegistry: project does not exist");
        
        Project storage project = projects[projectId];
        require(project.status == ProjectStatus.Active, "ProjectRegistry: project not active");
        
        project.status = ProjectStatus.Cancelled;
        emit ProjectStatusChanged(projectId, ProjectStatus.Cancelled);
    }
    
    /**
     * @dev Withdraw raised funds to treasury when project is completed
     * @param projectId ID of the completed project
     * @param treasury Address to withdraw funds to
     */
    function withdrawToTreasury(uint256 projectId, address treasury) external onlyOwner {
        require(projectId < projectCount, "ProjectRegistry: project does not exist");
        require(treasury != address(0), "ProjectRegistry: treasury address cannot be zero");
        
        Project storage project = projects[projectId];
        require(project.status == ProjectStatus.Completed, "ProjectRegistry: project not completed");
        require(project.raised > 0, "ProjectRegistry: no funds to withdraw");
        
        uint256 amount = project.raised;
        project.raised = 0; // Prevent re-withdrawal
        
        require(ecoToken.transfer(treasury, amount), "ProjectRegistry: transfer to treasury failed");
    }
    
    /**
     * @dev Refund contributors when project is cancelled
     * @param projectId ID of the cancelled project
     * @param contributor Address of the contributor to refund
     */
    function refund(uint256 projectId, address contributor) external whenNotPaused nonReentrant {
        require(projectId < projectCount, "ProjectRegistry: project does not exist");
        require(contributor != address(0), "ProjectRegistry: contributor address cannot be zero");
        
        Project storage project = projects[projectId];
        require(project.status == ProjectStatus.Cancelled, "ProjectRegistry: project not cancelled");
        
        uint256 contributionAmount = contributions[projectId][contributor];
        require(contributionAmount > 0, "ProjectRegistry: no contribution to refund");
        
        contributions[projectId][contributor] = 0;
        project.raised -= contributionAmount;
        
        require(ecoToken.transfer(contributor, contributionAmount), "ProjectRegistry: refund transfer failed");
    }
    
    /**
     * @dev Update XP conversion rate (only owner)
     * @param newRate New rate (ECO tokens per 1 XP)
     */
    function updateXPRate(uint256 newRate) external onlyOwner {
        require(newRate > 0, "ProjectRegistry: rate must be positive");
        
        uint256 oldRate = xpPerEcoRate;
        xpPerEcoRate = newRate;
        
        emit XPRateUpdated(oldRate, newRate);
    }
    
    /**
     * @dev Get project details
     * @param projectId ID of the project
     * @return project The project struct
     */
    function getProject(uint256 projectId) external view returns (Project memory project) {
        require(projectId < projectCount, "ProjectRegistry: project does not exist");
        return projects[projectId];
    }
    
    /**
     * @dev Get contributor's contribution amount for a project
     * @param projectId ID of the project
     * @param contributor Address of the contributor
     * @return amount The contribution amount
     */
    function getContribution(uint256 projectId, address contributor) external view returns (uint256 amount) {
        return contributions[projectId][contributor];
    }
    
    /**
     * @dev Pause the contract (emergency stop)
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
}