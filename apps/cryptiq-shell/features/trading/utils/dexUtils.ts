// File: features/trading/utils/dexUtils.ts

import { BigNumber, ethers } from 'ethers'
import { Provider } from '@ethersproject/providers'
import { PairLiquidity } from '../types/dexTypes'
import { BatchSwapParams } from '../types/dexTypes'
import { AGGREGATOR_ABI } from '../constants/dexConstants'
import { ONEINCH_AGGREGATOR_ADDRESS } from '../constants/dexConstants'

export async function getPoolLiquidity(
  poolContract: ethers.Contract,
  tokenA: string,
  tokenB: string
): Promise<PairLiquidity> {
  const [reserve0, reserve1] = await poolContract.getReserves()
  const token0 = await poolContract.token0()
  const [tokenIn, tokenOut] = token0.toLowerCase() === tokenA.toLowerCase() 
    ? [tokenA, tokenB]
    : [tokenB, tokenA]
  
  return {
    tokenIn,
    tokenOut,
    liquidity: reserve0.add(reserve1),
    price: reserve1.mul(ethers.constants.WeiPerEther).div(reserve0).toNumber() / 1e18,
    lastUpdate: Date.now(),
    reserves: [reserve0, reserve1]
  }
}

export async function getPrice(
  provider: Provider,
  tokenIn: string,
  tokenOut: string,
  amount: BigNumber = ethers.utils.parseEther('1')
): Promise<number> {
  const aggregator = new ethers.Contract(
    ONEINCH_AGGREGATOR_ADDRESS,
    AGGREGATOR_ABI,
    provider
  )
  
  const rate = await aggregator.getRate(tokenIn, tokenOut, amount)
  return Number(ethers.utils.formatEther(rate))
}

export function calculateActualProfit(
  receipt: ethers.ContractReceipt,
  gasPrice: BigNumber
): BigNumber {
  const gasCost = receipt.gasUsed.mul(gasPrice)
  
  // Find transfer events to calculate actual returned tokens
  const returnAmount = receipt.logs
    .filter(log => log.topics[0] === ethers.utils.id('Transfer(address,address,uint256)'))
    .reduce((total, log) => {
      const parsed = ethers.utils.defaultAbiCoder.decode(
        ['uint256'],
        log.data
      )
      return total.add(parsed[0])
    }, BigNumber.from(0))

  return returnAmount.sub(gasCost)
}

export function sortPoolsByLiquidity(
  pools: PairLiquidity[]
): PairLiquidity[] {
  return [...pools].sort((a, b) => 
    b.liquidity.sub(a.liquidity).gt(0) ? 1 : -1
  )
}

export async function createProtectedBundle(
    provider: Provider,
    params: BatchSwapParams,
    signer: ethers.Signer // Add signer as a parameter
  ): Promise<any> {
  // Create flashbots bundle
  const block = await provider.getBlock('latest')
  const blockNumber = block.number
  
  return {
    transactions: [{
      signer: signer, // Use the signer passed to the function
      transaction: params
    }],
    blockNumber: blockNumber + 1,
    minTimestamp: block.timestamp,
    maxTimestamp: block.timestamp + 120, // 2 min validity
    revertingTxHashes: [] // Txs that should revert if this fails
  }
}

export async function submitProtectedTransaction(
  provider: Provider,
  bundle: any
): Promise<ethers.ContractTransaction> {
  const flashbotsProvider = await require('@flashbots/ethers-provider-bundle').FlashbotsBundleProvider
    .create(provider, ethers.Wallet.createRandom())
  
  const signedBundle = await flashbotsProvider.signBundle(bundle.transactions)
  const simulation = await flashbotsProvider.simulate(signedBundle, bundle.blockNumber)
  
  if (simulation.firstRevert) {
    throw new Error(`Bundle simulation failed: ${simulation.firstRevert}`)
  }

  const bundleSubmission = await flashbotsProvider.sendBundle(bundle)
  const waitResponse = await bundleSubmission.wait()
  
  if (waitResponse.status === 'included') {
    return waitResponse.transactionReceipt
  } else {
    throw new Error(`Bundle failed: ${waitResponse.status}`)
  }
}