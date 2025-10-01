// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title EcoPoints
 * @dev Non-transferable SBT (Soul Bound Token) for EcoDAO XP system
 * @notice This token represents experience points and cannot be transferred between accounts
 */
contract EcoPoints is ERC20, AccessControl, Pausable {
    // Role for minting points
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    // Role for pausing the contract
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    // Events
    event PointsMinted(address indexed user, uint256 amount, string reason);
    event PointsBurned(address indexed user, uint256 amount, string reason);
    
    constructor(
        string memory name,
        string memory symbol,
        address admin
    ) ERC20(name, symbol) {
        // Set up roles
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
    }
    
    /**
     * @dev Mint points to a specific address
     * @param to Address to mint points to
     * @param amount Amount of points to mint
     * @param reason Reason for minting (for transparency)
     */
    function mint(address to, uint256 amount, string memory reason) external onlyRole(MINTER_ROLE) whenNotPaused {
        require(to != address(0), "EcoPoints: mint to zero address");
        require(amount > 0, "EcoPoints: mint amount must be positive");
        
        _mint(to, amount);
        emit PointsMinted(to, amount, reason);
    }
    
    /**
     * @dev Burn points from a specific address
     * @param from Address to burn points from
     * @param amount Amount of points to burn
     * @param reason Reason for burning (for transparency)
     */
    function burn(address from, uint256 amount, string memory reason) external onlyRole(MINTER_ROLE) whenNotPaused {
        require(from != address(0), "EcoPoints: burn from zero address");
        require(amount > 0, "EcoPoints: burn amount must be positive");
        require(balanceOf(from) >= amount, "EcoPoints: burn amount exceeds balance");
        
        _burn(from, amount);
        emit PointsBurned(from, amount, reason);
    }
    
    /**
     * @dev Override transfer to make tokens non-transferable
     */
    function transfer(address, uint256) public pure override returns (bool) {
        revert("EcoPoints: tokens are non-transferable");
    }
    
    /**
     * @dev Override transferFrom to make tokens non-transferable
     */
    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert("EcoPoints: tokens are non-transferable");
    }
    
    /**
     * @dev Override approve to make tokens non-transferable
     */
    function approve(address, uint256) public pure override returns (bool) {
        revert("EcoPoints: tokens are non-transferable");
    }
    
    /**
     * @dev Pause the contract (emergency stop)
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause the contract
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Get the number of decimal places for the token
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}