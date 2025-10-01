// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./GreenToken.sol";
import "./GreenGovernor.sol";

/**
 * @title ActionRewards
 * @dev Contract for rewarding environmental actions with EcoTokens
 * @notice Handles action submission, verification, and token distribution
 */
contract ActionRewards is AccessControl, ReentrancyGuard, Pausable {
    using Counters for Counters.Counter;
    
    // Enums
    enum ActionType {
        COMPOSTING,      // 0
        CYCLING,         // 1
        ENERGY_SAVING,   // 2
        WASTE_REDUCTION, // 3
        WATER_CONSERVATION, // 4
        RENEWABLE_ENERGY,   // 5
        TREE_PLANTING,      // 6
        CLEANUP_EVENT,      // 7
        SUSTAINABLE_TRANSPORT, // 8
        RECYCLING          // 9
    }
    
    enum VerificationStatus {
        PENDING,    // 0
        VERIFIED,   // 1
        REJECTED    // 2
    }
    
    // Structs
    struct Action {
        address user;
        string actionType; // String representation for governance proposals
        string metadataURI; // IPFS hash or metadata URI
        uint256 timestamp;
        ActionType enumActionType; // Keep enum for rewards calculation
        string ipfsHash; // Backward compatibility
        uint256 rewardAmount;
        VerificationStatus status;
        address verifier;
        string verificationNote;
        uint256 proposalId; // Link to governance proposal
    }
    
    struct Verifier {
        address verifierAddress;
        uint256 reputation;
        uint256 totalVerifications;
        uint256 successfulVerifications;
        bool isActive;
    }
    
    // State variables
    Counters.Counter private _actionCounter;
    Counters.Counter private _verifierCounter;
    
    GreenToken public immutable greenToken;
    GreenGovernor public greenGovernor; // Governor contract for proposals
    
    // Mappings
    mapping(uint256 => Action) public actions;
    mapping(address => uint256[]) public userActions;
    mapping(address => Verifier) public verifiers;
    mapping(ActionType => uint256) public actionRewards;
    mapping(address => uint256) public userActionCount;
    mapping(address => uint256) public lastActionTime;
    mapping(uint256 => uint256) public proposalToAction; // Map proposal ID to action ID
    
    // Constants
    uint256 public constant COOLDOWN_PERIOD = 1 hours; // Anti-spam cooldown
    uint256 public constant MIN_REPUTATION = 10; // Minimum reputation to verify
    uint256 public constant VERIFICATION_REWARD = 1 * 10**18; // 1 EcoToken for verification
    
    // Events
    event ActionSubmitted(
        uint256 indexed actionId,
        address indexed user,
        string actionType,
        string metadataURI
    );
    
    event ProposalCreatedForAction(
        uint256 indexed actionId,
        uint256 indexed proposalId,
        string description
    );
    
    event ActionVerified(
        uint256 indexed actionId,
        address indexed verifier,
        bool approved,
        string note
    );
    
    event TokensRewarded(
        uint256 indexed actionId,
        address indexed user,
        uint256 amount
    );
    
    event VerifierAdded(address indexed verifier, uint256 reputation);
    event VerifierRemoved(address indexed verifier);
    event ReputationUpdated(address indexed verifier, uint256 newReputation);
    
    // Modifiers
    modifier onlyVerifier() {
        require(verifiers[msg.sender].isActive, "ActionRewards: Not an active verifier");
        _;
    }
    
    modifier cooldownCheck() {
        require(
            block.timestamp >= lastActionTime[msg.sender] + COOLDOWN_PERIOD,
            "ActionRewards: Cooldown period not met"
        );
        _;
    }
    
    constructor(address _greenToken) {
        greenToken = GreenToken(_greenToken);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        
        // Set up initial action rewards (in EcoTokens)
        actionRewards[ActionType.COMPOSTING] = 5 * 10**18;        // 5 EcoTokens
        actionRewards[ActionType.CYCLING] = 3 * 10**18;           // 3 EcoTokens
        actionRewards[ActionType.ENERGY_SAVING] = 4 * 10**18;     // 4 EcoTokens
        actionRewards[ActionType.WASTE_REDUCTION] = 3 * 10**18;   // 3 EcoTokens
        actionRewards[ActionType.WATER_CONSERVATION] = 2 * 10**18; // 2 EcoTokens
        actionRewards[ActionType.RENEWABLE_ENERGY] = 10 * 10**18;  // 10 EcoTokens
        actionRewards[ActionType.TREE_PLANTING] = 8 * 10**18;     // 8 EcoTokens
        actionRewards[ActionType.CLEANUP_EVENT] = 6 * 10**18;     // 6 EcoTokens
        actionRewards[ActionType.SUSTAINABLE_TRANSPORT] = 2 * 10**18; // 2 EcoTokens
        actionRewards[ActionType.RECYCLING] = 1 * 10**18;         // 1 EcoToken
    }

    /**
     * @dev Set the governor contract address (can only be called by admin)
     * @param _governor Address of the GreenGovernor contract
     */
    function setGovernor(address _governor) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_governor != address(0), "ActionRewards: Invalid governor address");
        greenGovernor = GreenGovernor(payable(_governor));
    }
    
    /**
     * @dev Submit an environmental action for verification and governance
     * @param actionType The type of action being submitted (string)
     * @param metadataURI IPFS hash or metadata URI of the action proof
     */
    function submitAction(string calldata actionType, string calldata metadataURI)
        external
        whenNotPaused
        cooldownCheck
        nonReentrant
    {
        require(bytes(actionType).length > 0, "ActionRewards: Action type required");
        require(bytes(metadataURI).length > 0, "ActionRewards: Metadata URI required");
        
        uint256 actionId = _actionCounter.current();
        
        // Convert string to enum for reward calculation (simplified mapping)
        ActionType enumType = _stringToActionType(actionType);
        uint256 rewardAmount = actionRewards[enumType];
        
        actions[actionId] = Action({
            user: msg.sender,
            actionType: actionType,
            metadataURI: metadataURI,
            timestamp: block.timestamp,
            enumActionType: enumType,
            ipfsHash: metadataURI, // Backward compatibility
            rewardAmount: rewardAmount,
            status: VerificationStatus.PENDING,
            verifier: address(0),
            verificationNote: "",
            proposalId: 0 // Will be set when proposal is created
        });
        
        userActions[msg.sender].push(actionId);
        lastActionTime[msg.sender] = block.timestamp;
        
        _actionCounter.increment();
        
        emit ActionSubmitted(actionId, msg.sender, actionType, metadataURI);
        
        // Create governance proposal if governor is set
        if (address(greenGovernor) != address(0)) {
            _createProposalForAction(actionId, actionType, metadataURI);
        }
    }

    /**
     * @dev Create a governance proposal for an action
     * @param actionId The action ID
     * @param actionType The action type string
     * @param metadataURI The metadata URI
     */
    function _createProposalForAction(
        uint256 actionId,
        string memory actionType,
        string memory metadataURI
    ) internal {
        string memory description = string(abi.encodePacked(
            "Approve Environmental Action: ", 
            actionType,
            "\\n\\nProof: ",
            metadataURI,
            "\\n\\nSubmitted by: ",
            _addressToString(msg.sender)
        ));
        
        // Create empty proposal (no specific execution needed for verification votes)
        address[] memory targets = new address[](0);
        uint256[] memory values = new uint256[](0);
        bytes[] memory calldatas = new bytes[](0);
        
        uint256 proposalId = greenGovernor.propose(targets, values, calldatas, description);
        
        // Update action with proposal ID
        actions[actionId].proposalId = proposalId;
        proposalToAction[proposalId] = actionId;
        
        emit ProposalCreatedForAction(actionId, proposalId, description);
    }

    /**
     * @dev Convert string action type to enum (simplified mapping)
     * @param actionType String representation of action type
     * @return ActionType enum value
     */
    function _stringToActionType(string memory actionType) internal pure returns (ActionType) {
        bytes32 actionHash = keccak256(abi.encodePacked(actionType));
        
        if (actionHash == keccak256("COMPOSTING")) return ActionType.COMPOSTING;
        if (actionHash == keccak256("CYCLING")) return ActionType.CYCLING;
        if (actionHash == keccak256("ENERGY_SAVING")) return ActionType.ENERGY_SAVING;
        if (actionHash == keccak256("WASTE_REDUCTION")) return ActionType.WASTE_REDUCTION;
        if (actionHash == keccak256("WATER_CONSERVATION")) return ActionType.WATER_CONSERVATION;
        if (actionHash == keccak256("RENEWABLE_ENERGY")) return ActionType.RENEWABLE_ENERGY;
        if (actionHash == keccak256("TREE_PLANTING")) return ActionType.TREE_PLANTING;
        if (actionHash == keccak256("CLEANUP_EVENT")) return ActionType.CLEANUP_EVENT;
        if (actionHash == keccak256("SUSTAINABLE_TRANSPORT")) return ActionType.SUSTAINABLE_TRANSPORT;
        if (actionHash == keccak256("RECYCLING")) return ActionType.RECYCLING;
        
        // Default to RECYCLING for unknown types
        return ActionType.RECYCLING;
    }

    /**
     * @dev Convert address to string
     * @param addr The address to convert
     * @return String representation of the address
     */
    function _addressToString(address addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3+i*2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
    
    /**
     * @dev Verify an action (only by verified verifiers)
     * @param actionId The action ID to verify
     * @param approved Whether the action is approved
     * @param note Verification note
     */
    function verifyAction(
        uint256 actionId,
        bool approved,
        string calldata note
    ) external onlyVerifier whenNotPaused nonReentrant {
        Action storage action = actions[actionId];
        require(action.user != address(0), "ActionRewards: Action does not exist");
        require(
            action.status == VerificationStatus.PENDING,
            "ActionRewards: Action already processed"
        );
        
        action.status = approved ? VerificationStatus.VERIFIED : VerificationStatus.REJECTED;
        action.verifier = msg.sender;
        action.verificationNote = note;
        
        // Update verifier stats
        Verifier storage verifier = verifiers[msg.sender];
        verifier.totalVerifications++;
        if (approved) {
            verifier.successfulVerifications++;
            verifier.reputation += 1;
            
            // Reward the user with tokens
            greenToken.mint(action.user, action.rewardAmount, "Action verification reward");
            userActionCount[action.user]++;
            
            emit TokensRewarded(actionId, action.user, action.rewardAmount);
        } else {
            // Slight reputation penalty for rejecting actions
            if (verifier.reputation > 0) {
                verifier.reputation -= 1;
            }
        }
        
        emit ActionVerified(actionId, msg.sender, approved, note);
        emit ReputationUpdated(msg.sender, verifier.reputation);
    }
    
    /**
     * @dev Add a new verifier
     * @param verifierAddress Address of the verifier
     * @param initialReputation Initial reputation score
     */
    function addVerifier(address verifierAddress, uint256 initialReputation)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(verifierAddress != address(0), "ActionRewards: Invalid verifier address");
        require(!verifiers[verifierAddress].isActive, "ActionRewards: Verifier already exists");
        
        verifiers[verifierAddress] = Verifier({
            verifierAddress: verifierAddress,
            reputation: initialReputation,
            totalVerifications: 0,
            successfulVerifications: 0,
            isActive: true
        });
        
        emit VerifierAdded(verifierAddress, initialReputation);
    }
    
    /**
     * @dev Remove a verifier
     * @param verifierAddress Address of the verifier to remove
     */
    function removeVerifier(address verifierAddress)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(verifiers[verifierAddress].isActive, "ActionRewards: Verifier not found");
        
        verifiers[verifierAddress].isActive = false;
        
        emit VerifierRemoved(verifierAddress);
    }
    
    /**
     * @dev Update action reward amounts
     * @param actionType The action type to update
     * @param newReward The new reward amount
     */
    function updateActionReward(ActionType actionType, uint256 newReward)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(actionType <= ActionType.RECYCLING, "ActionRewards: Invalid action type");
        actionRewards[actionType] = newReward;
    }
    
    /**
     * @dev Pause the contract
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Get user's action history
     * @param user Address of the user
     * @return Array of action IDs
     */
    function getUserActions(address user) external view returns (uint256[] memory) {
        return userActions[user];
    }
    
    /**
     * @dev Get action details
     * @param actionId The action ID
     * @return Action struct
     */
    function getAction(uint256 actionId) external view returns (Action memory) {
        return actions[actionId];
    }
    
    /**
     * @dev Get pending actions for verification
     * @return Array of pending action IDs
     */
    function getPendingActions() external view returns (uint256[] memory) {
        uint256 totalActions = _actionCounter.current();
        uint256 pendingCount = 0;
        
        // Count pending actions
        for (uint256 i = 0; i < totalActions; i++) {
            if (actions[i].status == VerificationStatus.PENDING) {
                pendingCount++;
            }
        }
        
        // Create array of pending action IDs
        uint256[] memory pendingActions = new uint256[](pendingCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < totalActions; i++) {
            if (actions[i].status == VerificationStatus.PENDING) {
                pendingActions[index] = i;
                index++;
            }
        }
        
        return pendingActions;
    }
    
    /**
     * @dev Get total actions count
     * @return Total number of actions submitted
     */
    function getTotalActions() external view returns (uint256) {
        return _actionCounter.current();
    }
    
    /**
     * @dev Get verifier statistics
     * @param verifierAddress Address of the verifier
     * @return Verifier struct
     */
    function getVerifierStats(address verifierAddress) external view returns (Verifier memory) {
        return verifiers[verifierAddress];
    }
}
