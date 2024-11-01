import React, { useState } from 'react'
import { Button } from '@/features/shared/ui/button'
import { Progress } from '@/features/shared/ui/progress'
import { Loader2, CheckCircle, AlertTriangle, Badge } from 'lucide-react'
import { DEXIntegrator } from '@/features/arbitrage/integrations/DEXIntegrator'
import { useToast } from '@/hooks/use-toast'
import { FlashLoanProvider, ScalpingOpportunity } from '../../types/screenerTypes'

interface QuickExecutionRowProps {
  opportunity: ScalpingOpportunity
  dexIntegrator: DEXIntegrator
  flashLoanProvider: FlashLoanProvider
}

export function QuickExecutionRow({ 
  opportunity, 
  dexIntegrator,
  flashLoanProvider
}: QuickExecutionRowProps) {
  const [executing, setExecuting] = useState(false)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  async function handleQuickExecute() {
    setExecuting(true)
    setProgress(20)

    try {
      // Quick liquidity check
      const routes = await dexIntegrator.getViableRoutes({
        tokenIn: opportunity.symbol.split('/')[1], // USDT
        tokenOut: opportunity.symbol.split('/')[0], // Token
        amount: calculateOptimalSize(opportunity)
      })

      setProgress(40)

      // Find best route
      const bestRoute = routes.reduce((best, current) => 
        current.expectedProfit.gt(best.expectedProfit) ? current : best
      )

      if (!bestRoute) {
        throw new Error('No profitable routes found')
      }

      setProgress(60)

      // Get flash loan if needed
      const loan = bestRoute.requiredCapital.gt(ethers.utils.parseEther('10000'))
        ? await flashLoanProvider.getFlashloan(bestRoute.tokenIn, bestRoute.requiredCapital)
        : null

      setProgress(80)

      // Execute trade
      const result = await executeTrade({
        route: bestRoute,
        flashLoan: loan,
        slippageTolerance: 0.5, // 0.5%
        deadlineMinutes: 2
      })

      setProgress(100)

      // Show success notification
      toast({
        title: "Trade Executed! 🚀",
        description: `Profit: $${ethers.utils.formatEther(result.profit)}`,
        variant: "success"
      })

    } catch (error) {
      toast({
        title: "Execution Failed",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setExecuting(false)
      setProgress(0)
    }
  }

  return (
    <div className="grid grid-cols-8 gap-4 py-2 hover:bg-muted/50 rounded-md items-center">
      {/* Original screener columns */}
      <div className="font-mono">{opportunity.symbol}</div>
      <div>${opportunity.price.toFixed(8)}</div>
      <div className={opportunity.change24h > 0 ? 'text-green-500' : 'text-red-500'}>
        {opportunity.change24h.toFixed(2)}%
      </div>
      <div>{opportunity.volume}</div>
      <div>{opportunity.volatility.toFixed(2)}%</div>
      <div className="flex gap-2">
        <span className="text-green-500">
          {opportunity.orderBookLevels.bids}
        </span>
        /
        <span className="text-red-500">
          {opportunity.orderBookLevels.asks}
        </span>
      </div>
      <div>
        {opportunity.dexLiquidity && (
          <Badge variant="outline">
            {opportunity.dexLiquidity.routes} routes
          </Badge>
        )}
      </div>

      {/* Quick execution column */}
      <div>
        {executing ? (
          <div className="space-y-2">
            <Progress value={progress} className="w-[100px]" />
            <div className="text-xs text-muted-foreground">
              {getProgressMessage(progress)}
            </div>
          </div>
        ) : (
          <Button 
            onClick={handleQuickExecute}
            variant="outline"
            className={`w-[100px] ${
              opportunity.dexLiquidity?.routes ? 'bg-green-500/10' : 'bg-yellow-500/10'
            }`}
          >
            {opportunity.dexLiquidity?.routes ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Execute
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Limited
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

function getProgressMessage(progress: number): string {
  if (progress < 40) return 'Checking routes...'
  if (progress < 60) return 'Finding best price...'
  if (progress < 80) return 'Getting flash loan...'
  if (progress < 100) return 'Executing trade...'
  return 'Complete!'
}

function calculateOptimalSize(opportunity: ScalpingOpportunity): BigNumber {
  // Calculate size based on:
  // 1. Available liquidity
  // 2. Volume 24h
  // 3. Current volatility
  const baseSize = ethers.utils.parseUnits('10000', 6) // 10k USDT
  
  // Adjust based on volatility
  const volAdjustment = Math.min(opportunity.volatility / 10, 1.5)
  
  // Adjust based on volume
  const volume = parseFloat(opportunity.volume.replace(/[^0-9.]/g, ''))
  const volAdjustment = Math.min(volume / 1000000, 2) // Cap at 2x for volumes over 1M

  return baseSize
    .mul(Math.floor(volAdjustment * 100))
    .div(100)
    .mul(Math.floor(volAdjustment * 100))
    .div(100)
}