import { Provider, Contract, TransactionResponse, TransactionReceipt } from 'ethers';
import { DEX_INTERFACES } from 'features/web3/utils/dex-data-pool-fetchers';

interface PendingThreat {
  from: string;
  gasPrice: bigint;
  estimatedProfit: bigint;
  targetDEX: string;
  targetToken: string;
  timestamp: number;
}

interface BlockActivity {
  swapCount: number;
  uniqueAddresses: Set<string>;
  totalValue: bigint;
  highValueTxs: number;
}

export class SandwichDetector {
  private readonly knownAttackers = new Set<string>();
  private pendingThreats: PendingThreat[] = [];
  private blockActivity: Map<number, BlockActivity> = new Map();
  private readonly ANALYSIS_BLOCKS = 1000;
  private readonly HIGH_VALUE_THRESHOLD = 10n * 10n ** 18n; // 10 ETH

  constructor(
    private readonly provider: Provider,
    private readonly dexContracts: Record<string, Contract>,
    private readonly minProfitThreshold: bigint = 5n * 10n ** 17n // 0.5 ETH
  ) {
    this.initializeBlockMonitor();
  }

  private initializeBlockMonitor() {
    // Monitor new blocks for MEV activity
    this.provider.on('block', (blockNumber) => {
      this.analyzeNewBlock(blockNumber).catch((error) =>
        console.error(`Error analyzing block ${blockNumber}:`, error)
      );
    });

    // Monitor pending transactions for potential frontrunning
    this.provider.on('pending', (txHash) => {
      // Pending transaction analysis is not implemented yet.
    });
  }

  private async analyzeNewBlock(blockNumber: number) {
    const block = await this.provider.getBlock(blockNumber, true);
    if (!block) return;

    const activity: BlockActivity = {
      swapCount: 0,
      uniqueAddresses: new Set(),
      totalValue: 0n,
      highValueTxs: 0,
    };

    for (const txHash of block.transactions) {
      const tx = await this.provider.getTransaction(txHash);
      if (tx && tx.from) {
        activity.uniqueAddresses.add(tx.from);
      }
      if (tx && tx.value) {
        activity.totalValue += tx.value;
      }

      if (tx && tx.value && tx.value > this.HIGH_VALUE_THRESHOLD) {
        activity.highValueTxs++;
      }

      if (tx && await this.isSwapTransaction(tx)) {
        activity.swapCount++;
      }

      if (tx !== null) {
        const blockTxs = await Promise.all(
          block.transactions.map(hash => this.provider.getTransaction(hash))
        );
        const validBlockTxs = blockTxs.filter((t): t is TransactionResponse => t !== null);
        await this.detectSandwichPattern(tx, validBlockTxs);
      }
    }
    
    this.blockActivity.set(blockNumber, activity);

    if (this.blockActivity.size > this.ANALYSIS_BLOCKS) {
      const oldestBlock = Math.min(...this.blockActivity.keys());
      this.blockActivity.delete(oldestBlock);
    }
}
  
   // Helper methods
  private async detectSandwichPattern(tx: TransactionResponse, blockTxs: TransactionResponse[]) {
    const txIndex = blockTxs.findIndex((t) => t.hash === tx.hash);
    if (txIndex === -1) return;

    const prevTx = blockTxs[txIndex - 1];
    const nextTx = blockTxs[txIndex + 1];

    if (prevTx && nextTx && prevTx.from === nextTx.from) {
      const profit = await this.calculateSandwichProfit(prevTx, tx, nextTx);
      if (profit > this.minProfitThreshold) {
        this.knownAttackers.add(prevTx.from);
        console.warn(`Detected sandwich attack from ${prevTx.from} with profit ${profit}`);
      }
    }
  }

  private async calculateSandwichProfit(
    frontrun: TransactionResponse,
    victim: TransactionResponse,
    backrun: TransactionResponse
  ): Promise<bigint> {
    try {
      const frontrunDecode = await this.decodeSwapTransaction(frontrun);
      const backrunDecode = await this.decodeSwapTransaction(backrun);

      if (frontrunDecode && backrunDecode) {
        return backrunDecode.amountOut - frontrunDecode.amountIn;
      }
    } catch (error) {
      console.error('Error calculating sandwich profit:', error);
    }

    return 0n;
  }

  private async isSwapTransaction(tx: TransactionResponse): Promise<boolean> {
    for (const [dexName, contract] of Object.entries(this.dexContracts)) {
      try {
        const iface = DEX_INTERFACES[dexName].interface;
        const decoded = iface.parseTransaction({ data: tx.data, value: tx.value });
        if (decoded?.name.toLowerCase().includes('swap')) {
          return true;
        }
      } catch {
        // Fail silently as not all transactions are relevant swaps
      }
    }
    return false;
  }

  private async decodeSwapTransaction(tx: TransactionResponse) {
    for (const [dexName, contract] of Object.entries(this.dexContracts)) {
      try {
        const iface = DEX_INTERFACES[dexName].interface;
        const decoded = iface.parseTransaction({ data: tx.data, value: tx.value });
        if (decoded?.name.toLowerCase().includes('swap')) {
          return {
            dex: dexName,
            amountIn: BigInt(decoded.args[0]),
            amountOut: BigInt(decoded.args[1]),
            path: decoded.args[2],
          };
        }
      } catch {
        // Fail silently as not all transactions are relevant
      }
    }
    return null;
  }

  async detectFrontRunning(tx: TransactionResponse): Promise<boolean> {
    const pendingTxs = await this.getPendingTransactionsForToken(tx);

    for (const pendingTx of pendingTxs) {
      if (
        pendingTx.gasPrice !== null &&
        tx.gasPrice !== null &&
        pendingTx.gasPrice > tx.gasPrice &&
        (await this.hasSimilarSwapPattern(pendingTx, tx))
      ) {
        return true;
      }
    }

    if (tx.from !== null && this.knownAttackers.has(tx.from)) {
      return true;
    }

    return false;
  }

  private async getPendingTransactionsForToken(tx: TransactionResponse): Promise<TransactionResponse[]> {
    throw new Error('getPendingTransactionsForToken is not yet implemented');
  }

  private async hasSimilarSwapPattern(tx1: TransactionResponse, tx2: TransactionResponse): Promise<boolean> {
    const decode1 = await this.decodeSwapTransaction(tx1);
    const decode2 = await this.decodeSwapTransaction(tx2);

    if (!decode1 || !decode2) return false;

    return (
      decode1.path[0] === decode2.path[0] &&
      decode1.path[decode1.path.length - 1] === decode2.path[decode2.path.length - 1]
    );
  }
}
