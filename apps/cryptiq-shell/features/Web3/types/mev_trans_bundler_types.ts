import { TransactionRequest } from "ethers"

// types.ts
export interface FlashbotsTransaction extends TransactionRequest {
    signedTransaction?: string
  }
  
  export interface BundleStats {
    expectedProfit: bigint
    gasUsed: bigint
    bundleScore: number
    competitionEstimate: number
  }
  
  export interface BundleSimulation {
    success: boolean
    gasUsed: bigint
    profit: bigint
    revertReason?: string
  }
  
  export interface MEVBuncherConfig {
    bundleTimeout?: number
    minProfitThreshold?: bigint
    maxBundleSize?: number
    frontrunProtection?: boolean
  }
  
  export interface MultiCallRequest {
    target: string
    callData: string
  }