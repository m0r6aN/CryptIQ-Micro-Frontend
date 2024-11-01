import React, { useState, useEffect } from 'react'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Progress } from '@/features/shared/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card'
import { ScrollArea } from '@/features/shared/ui/scroll-area'
import { Opportunity } from '../../types/opportunity'
import { Badge } from '@/features/shared/ui/badge'

const OrderFlowScanner = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null)

  // Simulate incoming opportunities
  useEffect(() => {
    const mockData = [
      { 
        id: 1,
        symbol: 'ETH-USDT',
        buyPressure: 0.75,
        impact: 0.12,
        sentiment: 'bullish',
        depth: {
          bids: [
            { price: 2300, volume: 10.5 },
            { price: 2299, volume: 15.2 },
          ],
          asks: [
            { price: 2301, volume: 8.3 },
            { price: 2302, volume: 12.1 },
          ]
        }
      }
    ]
    setOpportunities(mockData)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Order Flow Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {opportunities.map(opp => (
              <div 
                key={opp.id}
                className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedOpp(() => opp)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{opp.symbol}</span>
                  <Badge variant={opp.sentiment === 'bullish' ? 'success' : 'destructive'}>
                    {opp.sentiment}
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Buy Pressure: {(opp.buyPressure * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">
                  Est. Impact: {(opp.impact * 100).toFixed(2)}%
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Market Depth Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedOpp && (
            <>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[...selectedOpp.depth.bids, ...selectedOpp.depth.asks]}>
                    <XAxis dataKey="price" />
                    <YAxis dataKey="volume" />
                    <Tooltip />
                    <Line type="stepAfter" dataKey="volume" stroke="#10b981" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Buy Pressure</div>
                  <Progress value={selectedOpp.buyPressure * 100} className="mt-2" />
                </div>
                <div>
                  <div className="text-sm font-medium">Market Impact</div>
                  <Progress value={selectedOpp.impact * 100} className="mt-2" />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default OrderFlowScanner