import React, { useMemo } from 'react'
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip } from 'recharts'
import { AlertTriangle, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card'
import { Badge } from '@/features/shared/ui/badge'
import { ScrollArea } from '@/features/shared/ui/scroll-area'

interface WhaleShadowProps {
  whaleData: {
    address: string
    value: number
    side: 'buy' | 'sell'
    timestamp: number
    liquidationPrice?: number
    shadowZone: {
      lower: number
      upper: number
      strength: number
    }
  }[]
  priceLevel: number
}

export function WhaleShadow({ whaleData, priceLevel }: WhaleShadowProps) {
  // Calculate shadow zones
  const shadowZones = useMemo(() => {
    return whaleData.reduce((zones, whale) => {
      const { lower, upper, strength } = whale.shadowZone
      const key = `${lower}-${upper}`
      
      if (!zones[key]) {
        zones[key] = { lower, upper, strength: 0, whales: [] }
      }
      
      zones[key].strength += strength
      zones[key].whales.push(whale)
      
      return zones
    }, {} as Record<string, any>)
  }, [whaleData])

  // Calculate liquidation risk
  const liquidationRisk = useMemo(() => {
    const nearbyLiquidations = whaleData
      .filter(w => w.liquidationPrice)
      .filter(w => Math.abs(w.liquidationPrice! - priceLevel) / priceLevel < 0.05)
    
    return {
      total: nearbyLiquidations.length,
      value: nearbyLiquidations.reduce((sum, w) => sum + w.value, 0)
    }
  }, [whaleData, priceLevel])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            Whale Shadow Tracker
          </div>
          {liquidationRisk.total > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              ${liquidationRisk.value.toLocaleString()} at risk
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis type="number" dataKey="price" name="Price" unit="$" />
              <YAxis type="number" dataKey="value" name="Value" unit="$" />
              <ZAxis type="number" dataKey="strength" range={[50, 400]} />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-4 rounded-lg shadow-lg border">
                        <div className="font-medium">Shadow Zone</div>
                        <div className="text-sm text-gray-600">
                          Range: ${data.lower.toFixed(2)} - ${data.upper.toFixed(2)}
                          <br />
                          Strength: {(data.strength * 100).toFixed(1)}%
                          <br />
                          Whales: {data.whales.length}
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Scatter
                data={Object.values(shadowZones)}
                fill="#8884d8"
                fillOpacity={0.6}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <ScrollArea className="h-[200px] mt-4">
          <div className="space-y-2">
            {whaleData
              .sort((a, b) => b.value - a.value)
              .map((whale, i) => (
                <div 
                  key={whale.address} 
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant={whale.side === 'buy' ? 'success' : 'destructive'}>
                      {whale.side.toUpperCase()}
                    </Badge>
                    <span className="font-mono text-sm">
                      {whale.address.slice(0, 6)}...{whale.address.slice(-4)}
                    </span>
                  </div>
                  <div className="text-sm">
                    ${whale.value.toLocaleString()}
                  </div>
                </div>
              ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}