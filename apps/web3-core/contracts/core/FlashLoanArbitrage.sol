// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract FlashLoanArbitrage is 
    Initializable,
    OwnableUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    UUPSUpgradeable 
{
    // Version for tracking upgrades
    uint256 public constant VERSION = 1;
    
    // State variables that need to persist through upgrades
    mapping(address => bool) public whitelistedCallers;
    uint256 public minProfitThreshold;
    
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _factory) public initializer {
        __Ownable_init();
        __Pausable_init();
        __ReentrancyGuard_init();
        __UUPSUpgradeable_init();
        
        minProfitThreshold = 0.1 ether; // Default threshold
    }

    // Required by UUPSUpgradeable
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    // Function that might need upgrading in the future
    function executeArbitrage(
        address[] calldata path,
        uint256 amount,
        bytes[] calldata swapData
    ) external whenNotPaused nonReentrant returns (uint256) {
        require(whitelistedCallers[msg.sender], "Caller not whitelisted");
        // ... rest of execution logic
    }

    // Emergency functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Upgrade preparation
    function prepareForUpgrade() external onlyOwner {
        // Clean up any state if needed before upgrade
    }
}