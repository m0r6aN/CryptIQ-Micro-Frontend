// File: features/trading/components/scanner/SmartScannerContainer.tsx

import React, { useEffect } from 'react'
import { MarketScanner } from './MarketScanner'
import { Activity } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useSignalDetection } from '../../hooks/useSignalDetection'
import { Button } from '@/features/shared/ui/button'

export function SmartScannerContainer() {
  const { signals, hotZones, analysis, activeSignals } = useSignalDetection({
    symbols: ['BTC-USDT', 'ETH-USDT'],
    minStrength: 0.7
  })

  const { toast } = useToast()

  useEffect(() => {
    // Notify on new signals
    if (activeSignals.length > 0) {
      const latestSignal = activeSignals[activeSignals.length - 1]
      toast({
        title: 'New Trading Signal',
        description: `${latestSignal.type.toUpperCase()} opportunity detected for ${latestSignal.symbol}`,
        variant: 'default'
      })
    }
  }, [activeSignals])

  if (!analysis) {
    return <div>Loading market data...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Market Scanner</h2>
        {activeSignals.length > 0 && (
          <Button variant="outline" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            {activeSignals.length} Active Signals
          </Button>
        )}
      </div>

      <MarketScanner 
        anomalies={analysis.anomalies}
        volatility={analysis.volatility}
        depth={analysis.depth}
        signals={activeSignals}
      />
    </div>
  )
}