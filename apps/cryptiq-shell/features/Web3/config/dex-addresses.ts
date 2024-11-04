import { ethers } from 'ethers'
import { NetworkAddresses } from '../types/dex'

type SupportedNetwork = 'mainnet' | 'arbitrum' | 'polygon';

export const DEX_ADDRESSES: Record<SupportedNetwork, NetworkAddresses> = {
    mainnet: {
      uniswap: {
        factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
        router: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
        quoter: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
      },
      sushiswap: {
        factory: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
        router: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'
      },
      curve: {
        registry: '0x90E00ACe148ca3b23Ac1bC8C240C2a7Dd9c2d7f5',
        addressProvider: '0x0000000022D53366457F9d5E68Ec105046FC4383'
      }
    },
    arbitrum: {
      uniswap: {
        factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
        router: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
        quoter: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
      },
      sushiswap: {
        factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
        router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'
      }
    },
    polygon: {
      uniswap: {
        factory: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
        router: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
        quoter: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
      },
      sushiswap: {
        factory: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
        router: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'
      }
    }
  } as const
  
  
  // Add network detection
  export const detectNetwork = async (provider: ethers.Provider): Promise<SupportedNetwork> => {
    const network = await provider.getNetwork()
    switch (network.chainId) {
      case 1n:
        return 'mainnet'
      case 42161n:
        return 'arbitrum'
      case 137n:
        return 'polygon'
      default:
        throw new Error(`Network ${network.chainId} not supported`)
    }
  }
  
  // Helper to get addresses for current network
  export const getCurrentNetworkAddresses = async (provider: ethers.Provider) => {
    const network = await detectNetwork(provider)
    return DEX_ADDRESSES[network]
  }