// Contract ABIs
export const UNISWAP_V3_FACTORY_ABI = [
    'function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool)',
    'event PoolCreated(address token0, address token1, uint24 fee, int24 tickSpacing, address pool)'
  ]
  
  export const SUSHISWAP_FACTORY_ABI = [
    'function allPairs(uint) external view returns (address pair)',
    'function allPairsLength() external view returns (uint)'
  ]
  
  export const CURVE_REGISTRY_ABI = [
    'function pool_count() external view returns (uint256)',
    'function pool_list(uint256) external view returns (address)',
    'function get_pool_coins(address) external view returns (address[8], address[8])'
  ]

 export const poolABI = [
    "function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
    // Add other needed pool methods
  ]
  
  export const priceOracleABI = [
    "function getPrice(address token) external view returns (uint256)",
    // Add other needed oracle methods
  ]
