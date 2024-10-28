import React, { useState, useEffect } from 'react'
import { Zap } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card'
import { Badge } from '@/features/shared/ui/badge'
import { PricePoint } from '@/features/shared/types/common'
import Sparkline from '@/features/trading/components/Sparkline'

const useDEXPriceStream = (): PricePoint[] => {
  const [prices, setPrices] = useState<PricePoint[]>([])
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5000/dex-stream')
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setPrices(prev => [...prev.slice(-100), {
        timestamp: Date.now(),
        price: data.uniswap, // base price
        dexPrices: {
          Uniswap: data.uniswap,
          Curve: data.curve,
          Balancer: data.balancer
        },
        volume: data.volume
      }])
    }

    return () => ws.close()
  }, [])

  return prices
}

export default function QuantumArbAnalyzer() {
  const prices = useDEXPriceStream()
  const [totalProfit, setTotalProfit] = useState(0)
  const [opportunities, setOpportunities] = useState(0)

  // Watch for arbitrage opportunities
  useEffect(() => {
    if (!prices.length) return
    const latest = prices[prices.length - 1]
    if (!latest?.dexPrices) return

    const allPrices = Object.values(latest.dexPrices)
    const spread = Math.max(...allPrices) - Math.min(...allPrices)

    if (spread > 15) { // Profitable threshold
      setTotalProfit(prev => prev + spread * 0.95)
      setOpportunities(prev => prev + 1)
    }
  }, [prices])

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Live DEX Analyzer
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="secondary">
              Opportunities: {opportunities}
            </Badge>
            <Badge className="bg-green-500">
              Profit: ${totalProfit.toFixed(2)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Sparkline 
          data={prices}
          height={300}
          width={800}
          className="mt-4"
        />
      </CardContent>
    </Card>
  )
}