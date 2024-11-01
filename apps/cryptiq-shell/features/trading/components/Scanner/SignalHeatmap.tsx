import React, { useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/features/shared/ui/card'
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip } from 'recharts'
import { OrderFlowData } from '@/types/orderFlow'
import { SentimentData } from '../../types/screenerTypes'
import { WhaleData } from '../../types/screenerTypes'

interface SignalHeatmapProps {
  orderFlow: OrderFlowData[]
  whaleActivity: WhaleData[]
  sentiment: SentimentData[]
  priceLevel: number
}

export const SignalHeatmap = ({ orderFlow, whaleActivity, sentiment, priceLevel }: SignalHeatmapProps) => {
  // Combine and normalize data for heatmap
  const heatmapData = useMemo(() => {
    return orderFlow.map(level => {
      const whaleData = whaleActivity.find(w => w.price === level.price)
      const sentimentData = sentiment.find(s => s.price === level.price)
      
      return {
        price: level.price,
        volume: level.volume,
        // Composite score calculation
        intensity: calculateIntensity({
          orderVolume: level.volume,
          whaleVolume: whaleData?.volume || 0,
          sentiment: sentimentData?.score || 0
        }),
        // Distance from current price
        proximity: Math.abs(level.price - priceLevel) / priceLevel
      }
    })
  }, [orderFlow, whaleActivity, sentiment, priceLevel])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <div className="font-medium">Price Level: ${data.price}</div>
          <div className="text-sm text-gray-600">
            <div>Volume: {data.volume.toLocaleString()}</div>
            <div>Signal Strength: {(data.intensity * 100).toFixed(1)}%</div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Signal Convergence Heatmap</span>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-200" />
            <span className="text-sm">Weak</span>
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-sm">Strong</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis 
                type="number" 
                dataKey="price" 
                name="Price" 
                unit="$"
                domain={['auto', 'auto']}
              />
              <YAxis 
                type="number" 
                dataKey="volume" 
                name="Volume"
                unit="K"
              />
              <ZAxis 
                type="number" 
                dataKey="intensity" 
                range={[50, 400]} 
                name="Intensity"
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter
                data={heatmapData}
                fill="#8884d8"
                fillOpacity={0.6}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Utility function to calculate signal intensity
function calculateIntensity({ orderVolume, whaleVolume, sentiment }: {
  orderVolume: number
  whaleVolume: number
  sentiment: number
}) {
  // Normalize each component
  const normalizedOrder = orderVolume / 1000 // Adjust scale as needed
  const normalizedWhale = whaleVolume / 10000
  const normalizedSentiment = (sentiment + 1) / 2

  // Weighted combination
  return (
    normalizedOrder * 0.4 +
    normalizedWhale * 0.4 +
    normalizedSentiment * 0.2
  )
}

export default SignalHeatmap