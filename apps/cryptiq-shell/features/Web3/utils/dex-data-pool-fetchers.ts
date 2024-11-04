import { Interface } from 'ethers'

// Define ABI objects properly
export const UNISWAP_V3_POOL_ABI = {
  fragments: [
    {
      name: 'swap',
      type: 'function',
      inputs: [
        { name: 'recipient', type: 'address' },
        { name: 'zeroForOne', type: 'bool' },
        { name: 'amountSpecified', type: 'int256' },
        { name: 'sqrtPriceLimitX96', type: 'uint160' },
        { name: 'data', type: 'bytes' }
      ],
      outputs: [
        { name: 'amount0', type: 'int256' },
        { name: 'amount1', type: 'int256' }
      ],
      stateMutability: 'nonpayable'
    },
    {
      name: 'slot0',
      type: 'function',
      inputs: [],
      outputs: [
        { name: 'sqrtPriceX96', type: 'uint160' },
        { name: 'tick', type: 'int24' },
        { name: 'observationIndex', type: 'uint16' },
        { name: 'observationCardinality', type: 'uint16' },
        { name: 'observationCardinalityNext', type: 'uint16' },
        { name: 'feeProtocol', type: 'uint8' },
        { name: 'unlocked', type: 'bool' }
      ],
      stateMutability: 'view'
    }
  ]
} as const

// Convert the ABI to an Interface
export const uniswapInterface = new Interface([
  'function swap(address recipient, bool zeroForOne, int256 amountSpecified, uint160 sqrtPriceLimitX96, bytes calldata data) external returns (int256 amount0, int256 amount1)',
  'function slot0() external view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)',
  'function liquidity() external view returns (uint128)',
  'function fee() external view returns (uint24)',
  'function token0() external view returns (address)',
  'function token1() external view returns (address)'
])

export interface DEXConfig {
  interface: Interface
  factoryAddress: string
  initCodeHash: string
  defaultFees: number[]
}

export const DEX_INTERFACES: Record<string, DEXConfig> = {
  UniswapV3: {
    interface: uniswapInterface,
    factoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
    initCodeHash: '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54',
    defaultFees: [500, 3000, 10000]
  }
  // ... other DEXes
}

// Helper function to get interface
export function getDEXInterface(dexName: keyof typeof DEX_INTERFACES): Interface {
  const dex = DEX_INTERFACES[dexName]
  if (!dex) {
    throw new Error(`Unknown DEX: ${dexName}`)
  }
  return dex.interface
}

// Helper to check if a method exists
export function isDEXMethod(dexName: string, methodName: string): boolean {
  const dex = DEX_INTERFACES[dexName as keyof typeof DEX_INTERFACES]
  if (!dex) return false
  
  return dex.interface.hasFunction(methodName)
}