export interface SafetyThresholds {
    maxDrawdown: number           // Maximum allowed drawdown percentage
    maxGasPrice: number          // Maximum gas price we'll accept
    minLiquidity: number         // Minimum liquidity required to execute
    maxExecutionTime: number     // Maximum allowed execution time in ms
    failureRateThreshold: number // Maximum acceptable failure rate
    minSuccessRate?: number      // Optional: Minimum required success rate
    maxToxicityScore?: number    // Optional: Maximum acceptable toxicity
}