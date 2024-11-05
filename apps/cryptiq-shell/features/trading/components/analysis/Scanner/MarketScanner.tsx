// File: features/trading/components/scanner/MarketScanner.tsx

import React from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { AlertTriangle, Activity, BarChart3 } from 'lucide-react'
import { SignalHeatmap } from './SignalHeatmap'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/features/shared/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card'
import { Badge } from '@/features/shared/ui/badge'

interface MarketScannerProps {
  anomalies: any[]
  volatility: any[]
  depth: {
    bids: any[]
    asks: any[]
  }
  signals: any[]
}

export function MarketScanner({ anomalies, volatility, depth, signals }: MarketScannerProps) {
  return (
    <Tabs defaultValue="signals" className="w-full">
      <TabsList className="grid grid-cols-4 max-w-[600px]">
        <TabsTrigger value="signals" className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Active Signals
        </TabsTrigger>
        <TabsTrigger value="heatmap" className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Heat Map
        </TabsTrigger>
        <TabsTrigger value="anomalies" className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Anomalies
        </TabsTrigger>
        <TabsTrigger value="depth" className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Market Depth
        </TabsTrigger>
      </TabsList>

      <div className="mt-4">
        <TabsContent value="signals">
          <Card>
            <CardHeader>
              <CardTitle>Active Trading Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {signals.map((signal, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{signal.symbol}</div>
                      <div className="text-sm text-gray-500">
                        Strength: {(signal.strength * 100).toFixed(1)}%
                      </div>
                    </div>
                    <Badge variant={signal.type === 'long' ? 'success' : 'destructive'}>
                      {signal.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap">
          <SignalHeatmap 
            orderFlow={depth.bids.concat(depth.asks)}
            whaleActivity={signals}
            sentiment={[]}
            priceLevel={depth.bids[0]?.price || 0}
          />
        </TabsContent>

        <TabsContent value="anomalies">
          <Card>
            <CardHeader>
              <CardTitle>Price Anomalies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={anomalies}>
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="deviation" 
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="depth">
          <Card>
            <CardHeader>
              <CardTitle>Market Depth Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[...depth.bids, ...depth.asks]}>
                    <XAxis dataKey="price" />
                    <YAxis dataKey="volume" />
                    <Tooltip />
                    <Line 
                      type="stepAfter" 
                      dataKey="volume" 
                      stroke="#10b981" 
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  )
}