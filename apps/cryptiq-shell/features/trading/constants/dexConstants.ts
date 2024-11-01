// File: features/trading/constants/dexConstants.ts

export const ONEINCH_AGGREGATOR_ADDRESS = '0x1111111254fb6c44bAC0beD2854e76F90643097d'

export const AGGREGATOR_ABI = [
  'function getRate(address fromToken, address toToken, uint256 amount) view returns (uint256)',
  'function swap(address fromToken, address toToken, uint256 amount, uint256 minReturn, bytes calldata permit, bytes calldata data) payable returns (uint256 returnAmount)',
  'function getExpectedReturn(address fromToken, address toToken, uint256 amount, uint256 parts, uint256 flags) view returns (uint256 returnAmount, uint256[] memory distribution)',
  'function getExpectedReturnWithGas(address fromToken,address toToken,uint256 amount,uint256 parts,uint256 flags,uint256 destTokenEthPriceTimesGasPrice) view returns (uint256 returnAmount,uint256 estimateGasAmount,uint256[] memory distribution)'
] as const

export const DEX_FEES = {
  UniswapV2: 0.003,
  UniswapV3: [0.0005, 0.003, 0.01],
  Sushiswap: 0.003,
  Balancer: 0.002,
  Curve: 0.0004
} as const