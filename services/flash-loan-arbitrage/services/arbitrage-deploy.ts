// deploy/deploy_arbitrage.ts
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { ethers } from 'hardhat'
import { getNetworkConfig } from '../config/networks'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  // Get network-specific addresses
  const networkConfig = getNetworkConfig(network.name)
  
  // Deploy factory first
  const factory = await deploy('FlashLoanArbitrageFactory', {
    from: deployer,
    args: [networkConfig.aaveV3LendingPool],
    log: true,
    waitConfirmations: networkConfig.confirmations,
  })

  // Deploy first arbitrage instance
  const arbitrageFactory = await ethers.getContractFactory('FlashLoanArbitrage')
  const arbitrage = await arbitrageFactory.deploy(networkConfig.aaveV3LendingPool)
  await arbitrage.deployed()

  // Verify on Etherscan
  if (networkConfig.shouldVerify) {
    await hre.run('verify:verify', {
      address: factory.address,
      constructorArguments: [networkConfig.aaveV3LendingPool],
    })

    await hre.run('verify:verify', {
      address: arbitrage.address,
      constructorArguments: [networkConfig.aaveV3LendingPool],
    })
  }

  // Save deployment info
  await deployments.save('FlashLoanArbitrage', {
    abi: arbitrageFactory.interface.format('json'),
    address: arbitrage.address,
  })
}

export default func
func.tags = ['FlashLoanArbitrage']

// scripts/create-arbitrage.ts
import { ethers } from 'hardhat'
import { getNetworkConfig } from '../config/networks'

async function main() {
  const networkConfig = getNetworkConfig(hre.network.name)
  
  // Get factory
  const factory = await ethers.getContractAt(
    'FlashLoanArbitrageFactory',
    networkConfig.factoryAddress
  )

  // Deploy new arbitrage contract
  const tx = await factory.deployNewArbitrage()
  const receipt = await tx.wait()

  // Get new arbitrage address from event
  const event = receipt.events?.find(e => e.event === 'ArbitrageDeployed')
  const arbitrageAddress = event?.args?.arbitrage

  console.log(`New arbitrage deployed at: ${arbitrageAddress}`)

  // Initialize arbitrage params if needed
  const arbitrage = await ethers.getContractAt(
    'FlashLoanArbitrage', 
    arbitrageAddress
  )

  // Optional: Set up initial configurations
  await arbitrage.setMinProfit(ethers.utils.parseEther('0.1')) // 0.1 ETH min profit
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

// hardhat.config.ts
import { HardhatUserConfig } from "hardhat/config"
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-etherscan"
import "hardhat-deploy"
import "hardhat-gas-reporter"
import { getNetworkConfig } from "./config/networks"

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  namedAccounts: {
    deployer: {
      default: 0
    }
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.ETH_MAINNET_URL || "",
        blockNumber: 15000000
      }
    },
    mainnet: {
      url: process.env.ETH_MAINNET_URL,
      accounts: [process.env.PRIVATE_KEY].filter(Boolean)
    },
    arbitrum: {
      url: process.env.ARBITRUM_URL,
      accounts: [process.env.PRIVATE_KEY].filter(Boolean)
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    gasPrice: 50
  }
}

export default config

// config/networks.ts
interface NetworkConfig {
  aaveV3LendingPool: string
  factoryAddress?: string
  confirmations: number
  shouldVerify: boolean
}

export function getNetworkConfig(network: string): NetworkConfig {
  const configs: { [key: string]: NetworkConfig } = {
    mainnet: {
      aaveV3LendingPool: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
      confirmations: 3,
      shouldVerify: true
    },
    arbitrum: {
      aaveV3LendingPool: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
      confirmations: 1,
      shouldVerify: true
    },
    hardhat: {
      aaveV3LendingPool: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2', // Mainnet fork
      confirmations: 1,
      shouldVerify: false
    }
  }

  const config = configs[network]
  if (!config) {
    throw new Error(`No config found for network ${network}`)
  }

  return config
}
