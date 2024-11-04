import { Transaction } from "ethers"
import { RiskScore } from "features/arbitrage/types/arbitrage-system-types"
import { Chain, ProtectionStrategy } from "features/arbitrage/types/arbitrage-system-types"
import { Route } from "features/web3/types/routing"

export interface Agent {
    id: string
    name: string
    type: string
    generation: number
    fitness: number
    accuracy: number
    status: 'training' | 'evolved' | 'deployed' | 'warning'
    specialization: string[]
    cpuUsage: number         // Changed from cpu
    memoryUsage: number      // Changed from memory
    lastSignal: string
  }
 

export interface AgentData {
    confidence: number
    type: string
    generation: number
    fitness: number
    accuracy: number
    trainedEpochs: number
    status: 'training' | 'evolved' | 'deployed'
    specialization: string[]
    cpu: number
    memory: number
    lastSignal: string
  }
  
  interface AgentUpdateMessage {
    type: 'AGENT_UPDATE'
    agentId: string
    data: Partial<Agent>  // Using Agent interface instead of AgentData
  }
  
  interface TrainingProgressMessage {
    type: 'TRAINING_PROGRESS'
    progress: number
  }
  
  export type AgentStreamMessage = AgentUpdateMessage | TrainingProgressMessage
  
  export interface ChainAgent {
    chainId: number
    rpc: string
    nativeToken: string
    supportedDEXs: string[]
    gasEstimator: () => Promise<number>
    blockMonitor: () => void
  }

  export interface SandwichDetector {
    detectFrontRunning: (tx: Transaction) => Promise<boolean>
    estimateAttackProbability: (route: string[]) => Promise<number>
    suggestProtection: () => Promise<ProtectionStrategy>
  }

  export interface BridgeMonitor {
    trackLiquidity: (bridges: string[]) => void
    estimateBridgeFees: () => Promise<number>
    suggestBridgeRoute: (from: Chain, to: Chain) => Promise<Route>
  }

  export interface RevertAnalyzer {
    analyzeHistoricalReverts: (route: string[]) => Promise<number>
    checkContractInteractions: (path: string[]) => Promise<RiskScore>
    suggestGasBuffer: () => Promise<number>
  }

  