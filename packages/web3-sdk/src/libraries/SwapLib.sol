// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

library SwapLib {
    using SafeERC20 for IERC20;

    struct SwapParams {
        address tokenIn;
        address tokenOut;
        uint256 amountIn;
        uint256 minAmountOut;
        address[] path;
        bytes routerData;
    }

    function executeSwap(
        SwapParams memory params,
        address router
    ) internal returns (uint256) {
        // Get initial balance
        uint256 initialBalance = IERC20(params.tokenOut).balanceOf(address(this));

        // Approve router
        IERC20(params.tokenIn).safeApprove(router, params.amountIn);

        // Execute swap via router
        (bool success,) = router.call(params.routerData);
        require(success, "Swap failed");

        // Reset approval
        IERC20(params.tokenIn).safeApprove(router, 0);

        // Calculate amount received
        uint256 finalBalance = IERC20(params.tokenOut).balanceOf(address(this));
        uint256 amountReceived = finalBalance - initialBalance;
        
        require(amountReceived >= params.minAmountOut, "Insufficient output");
        
        return amountReceived;
    }
}