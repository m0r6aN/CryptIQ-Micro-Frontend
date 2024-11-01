// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.19;

import "./FlashLoanArbitrage.sol"; 
contract FlashLoanArbitrageV2 is FlashLoanArbitrage {
    // New state variables for V2
    mapping(address => uint256) public userProfits;
    uint256 public maxGasPrice;

    // New events for V2
    event ProfitRecorded(address user, uint256 amount);

    // Initialize V2-specific state
    function initializeV2(uint256 _maxGasPrice) external reinitializer(2) {
        maxGasPrice = _maxGasPrice;
    }

    // Enhanced execution with gas price check and profit tracking
    function executeArbitrage(
        address[] calldata path,
        uint256 amount,
        bytes[] calldata swapData
    ) external override whenNotPaused nonReentrant returns (uint256) {
        require(tx.gasprice <= maxGasPrice, "Gas price too high");
        uint256 profit = super.executeArbitrage(path, amount, swapData);
        
        // New V2 functionality
        userProfits[msg.sender] += profit;
        emit ProfitRecorded(msg.sender, profit);
        
        return profit;
    }
}