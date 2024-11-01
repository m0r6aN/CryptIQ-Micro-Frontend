// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.19;

library SafetyLib {
    // Calculate minimum output with slippage protection
    function calculateMinOutput(
        uint256 expectedAmount,
        uint256 slippageTolerance
    ) internal pure returns (uint256) {
        return expectedAmount - ((expectedAmount * slippageTolerance) / 10000);
    }

    // Verify profitability
    function verifyProfitable(
        uint256 startAmount,
        uint256 endAmount,
        uint256 flashLoanPremium,
        uint256 minProfit
    ) internal pure returns (bool, uint256) {
        uint256 totalCost = startAmount + flashLoanPremium;
        if (endAmount <= totalCost) {
            return (false, 0);
        }
        uint256 profit = endAmount - totalCost;
        return (profit >= minProfit, profit);
    }

    // Emergency stop functionality
    function isEmergencyStop(
        uint256 gasPrice,
        uint256 maxGasPrice,
        uint256 totalValue,
        uint256 minValue
    ) internal pure returns (bool) {
        if (gasPrice > maxGasPrice) return true;
        if (totalValue < minValue) return true;
        return false;
    }
}