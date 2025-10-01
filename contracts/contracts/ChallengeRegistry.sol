// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./EcoPoints.sol";

/**
 * @title ChallengeRegistry
 * @dev Contract for managing environmental challenges that reward XP points
 * @notice Users can join challenges to earn XP points
 */
contract ChallengeRegistry is Ownable, Pausable {
    // Challenge structure
    struct Challenge {
        uint256 id;
        string name;
        string description;
        uint256 xpReward;
        bool active;
        uint256 createdAt;
    }
    
    // State variables
    EcoPoints public immutable points;
    
    mapping(uint256 => Challenge) public challenges;
    mapping(uint256 => mapping(address => bool)) public hasJoined; // challengeId => user => joined
    mapping(uint256 => uint256) public joinCount; // challengeId => total joins
    uint256 public challengeCount;
    
    // Events
    event ChallengeCreated(
        uint256 indexed id,
        string name,
        uint256 xpReward,
        bool active
    );
    
    event ChallengeJoined(
        address indexed user,
        uint256 indexed id,
        uint256 xpReward
    );
    
    event ChallengeStatusUpdated(uint256 indexed id, bool active);
    
    constructor(address _points, address admin) {
        require(_points != address(0), "ChallengeRegistry: Points address cannot be zero");
        points = EcoPoints(_points);
        _transferOwnership(admin);
        
        // Seed demo challenges
        _createInitialChallenges();
    }
    
    /**
     * @dev Create initial demo challenges
     */
    function _createInitialChallenges() private {
        _createChallenge("Green Commute Day", "Use eco-friendly transportation for a day", 150 * 1e18);
        _createChallenge("Energy Conservation", "Reduce energy usage at home", 200 * 1e18);
        _createChallenge("Community Cleanup", "Participate in local cleanup activity", 300 * 1e18);
    }
    
    /**
     * @dev Internal function to create a challenge
     * @param name Challenge name
     * @param description Challenge description
     * @param xpReward XP reward for completing the challenge
     * @return challengeId The ID of the created challenge
     */
    function _createChallenge(
        string memory name,
        string memory description,
        uint256 xpReward
    ) private returns (uint256 challengeId) {
        challengeId = challengeCount++;
        
        challenges[challengeId] = Challenge({
            id: challengeId,
            name: name,
            description: description,
            xpReward: xpReward,
            active: true,
            createdAt: block.timestamp
        });
        
        emit ChallengeCreated(challengeId, name, xpReward, true);
    }
    
    /**
     * @dev Create a new challenge (only owner)
     * @param name Challenge name
     * @param description Challenge description
     * @param xpReward XP reward for completing the challenge
     * @return challengeId The ID of the created challenge
     */
    function createChallenge(
        string memory name,
        string memory description,
        uint256 xpReward
    ) external onlyOwner returns (uint256 challengeId) {
        require(bytes(name).length > 0, "ChallengeRegistry: name cannot be empty");
        require(xpReward > 0, "ChallengeRegistry: XP reward must be positive");
        
        return _createChallenge(name, description, xpReward);
    }
    
    /**
     * @dev Join a challenge and earn XP points
     * @param challengeId ID of the challenge to join
     */
    function join(uint256 challengeId) external whenNotPaused {
        require(challengeId < challengeCount, "ChallengeRegistry: challenge does not exist");
        require(!hasJoined[challengeId][msg.sender], "ChallengeRegistry: already joined this challenge");
        
        Challenge storage challenge = challenges[challengeId];
        require(challenge.active, "ChallengeRegistry: challenge not active");
        
        // Mark as joined
        hasJoined[challengeId][msg.sender] = true;
        joinCount[challengeId]++;
        
        // Mint XP points
        points.mint(msg.sender, challenge.xpReward, "CHALLENGE");
        
        emit ChallengeJoined(msg.sender, challengeId, challenge.xpReward);
    }
    
    /**
     * @dev Update challenge status (only owner)
     * @param challengeId ID of the challenge
     * @param active New active status
     */
    function updateChallengeStatus(uint256 challengeId, bool active) external onlyOwner {
        require(challengeId < challengeCount, "ChallengeRegistry: challenge does not exist");
        
        challenges[challengeId].active = active;
        emit ChallengeStatusUpdated(challengeId, active);
    }
    
    /**
     * @dev Get challenge details
     * @param challengeId ID of the challenge
     * @return challenge The challenge struct
     */
    function getChallenge(uint256 challengeId) external view returns (Challenge memory challenge) {
        require(challengeId < challengeCount, "ChallengeRegistry: challenge does not exist");
        return challenges[challengeId];
    }
    
    /**
     * @dev Check if user has joined a specific challenge
     * @param challengeId ID of the challenge
     * @param user Address of the user
     * @return joined Whether the user has joined
     */
    function getUserJoinStatus(uint256 challengeId, address user) external view returns (bool joined) {
        return hasJoined[challengeId][user];
    }
    
    /**
     * @dev Get all active challenges
     * @return activeChallenges Array of active challenges
     */
    function getActiveChallenges() external view returns (Challenge[] memory activeChallenges) {
        // Count active challenges
        uint256 activeCount = 0;
        for (uint256 i = 0; i < challengeCount; i++) {
            if (challenges[i].active) {
                activeCount++;
            }
        }
        
        // Build array of active challenges
        activeChallenges = new Challenge[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < challengeCount; i++) {
            if (challenges[i].active) {
                activeChallenges[index] = challenges[i];
                index++;
            }
        }
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