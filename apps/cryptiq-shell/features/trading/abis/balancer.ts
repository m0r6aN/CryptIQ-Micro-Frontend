// File: features/trading/abis/balancer.ts

export const BALANCER_VAULT_ADDRESS = '0xBA12222222228d8Ba445958a75a0704d566BF2C8'

export const BALANCER_VAULT_ABI = [
  'function getPool(bytes32 poolId) view returns (address, uint8)',
  'function getPoolTokens(bytes32 poolId) view returns (address[] tokens, uint256[] balances, uint256 lastChangeBlock)',
  'function swap(SingleSwap memory singleSwap, FundManagement memory funds, uint256 limit, uint256 deadline) returns (uint256)',
  'function batchSwap(uint8 kind, BatchSwapStep[] swaps, address[] assets, FundManagement funds, int256[] limits, uint256 deadline) returns (int256[])',
  'event Swap(bytes32 indexed poolId, address indexed tokenIn, address indexed tokenOut, uint256 amountIn, uint256 amountOut)'
] as const