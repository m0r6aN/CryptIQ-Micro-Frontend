// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

interface IDexRouter {
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
}

library CallDataLib {
    function encodeUniswapSwap(
        address router,
        uint256 amountIn,
        uint256 amountOutMin,
        address[] memory path,
        address to,
        uint256 deadline
    ) internal pure returns (bytes memory) {
        return abi.encodeWithSelector(
            IDexRouter.swapExactTokensForTokens.selector,
            amountIn,
            amountOutMin,
            path,
            to,
            deadline
        );
    }

    function encodeCurveSwap(
        address pool,
        int128 i,
        int128 j,
        uint256 amountIn,
        uint256 minAmountOut
    ) internal pure returns (bytes memory) {
        return abi.encodeWithSelector(
            bytes4(keccak256("exchange(int128,int128,uint256,uint256)")),
            i,
            j,
            amountIn,
            minAmountOut
        );
    }

    function encodeBalancerSwap(
        address vault,
        bytes32 poolId,
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) internal pure returns (bytes memory) {
        return abi.encodeWithSelector(
            bytes4(keccak256("swap((bytes32,uint8,address,address,uint256,bytes))")),
            poolId,
            1, // GIVEN_IN
            tokenIn,
            tokenOut,
            amountIn,
            minAmountOut
        );
    }
}