import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network, ethers } = hre
  const { deploy, execute } = deployments
  const { deployer } = await getNamedAccounts()

  console.log('🚀 Deploying FlashLoanArbitrage contracts...')
  console.log('Network:', network.name)
  console.log('Deployer:', deployer)

  // Deploy factory first
  const factory = await deploy('FlashLoanArbitrageFactory', {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
    waitConfirmations: network.name === 'hardhat' ? 1 : 5
  })

  // Deploy arbitrage implementation
  const arbitrage = await deploy('FlashLoanArbitrage', {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
    waitConfirmations: network.name === 'hardhat' ? 1 : 5,
    proxy: {
      proxyContract: 'OpenZeppelinTransparentProxy',
      execute: {
        init: {
          methodName: 'initialize',
          args: [factory.address]
        }
      }
    }
  })

  // Verify contracts if we're on a real network
  if (network.name !== 'hardhat' && network.name !== 'localhost') {
    console.log('📝 Verifying contracts...')
    
    try {
      await hre.run('verify:verify', {
        address: factory.address,
        constructorArguments: []
      })
      
      await hre.run('verify:verify', {
        address: arbitrage.address,
        constructorArguments: []
      })

      console.log('✅ Verification complete')
    } catch (error) {
      console.error('❌ Verification failed:', error)
    }
  }

  // Update SDK contract addresses
  await updateSdkAddresses({
    factory: factory.address,
    arbitrage: arbitrage.address,
    network: network.name
  })

  return true
}

func.tags = ['FlashLoanArbitrage']
export default func

// File: apps/web3-core/scripts/updateAddresses.ts
import fs from 'fs'
import path from 'path'

interface ContractAddresses {
  factory: string
  arbitrage: string
  network: string
}

async function updateSdkAddresses(addresses: ContractAddresses) {
  const sdkPath = path.join(__dirname, '../../../packages/web3-sdk')
  const addressesPath = path.join(sdkPath, 'src/addresses.json')

  let currentAddresses = {}
  if (fs.existsSync(addressesPath)) {
    currentAddresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'))
  }

  const updatedAddresses = {
    ...currentAddresses,
    [addresses.network]: {
      factory: addresses.factory,
      arbitrage: addresses.arbitrage
    }
  }

  fs.writeFileSync(
    addressesPath,
    JSON.stringify(updatedAddresses, null, 2)
  )

  // Generate TypeScript types
  const typesContent = `
// This file is auto-generated - do not edit
export const CONTRACT_ADDRESSES = ${JSON.stringify(updatedAddresses, null, 2)} as const

export type NetworkAddresses = typeof CONTRACT_ADDRESSES
  `.trim()

  fs.writeFileSync(
    path.join(sdkPath, 'src/types/addresses.ts'),
    typesContent
  )
}