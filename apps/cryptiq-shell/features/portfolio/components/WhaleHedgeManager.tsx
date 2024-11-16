import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card'
import { Badge } from '@/features/shared/ui/badge'
import { Button } from '@/features/shared/ui/button'
import { Shield, Fish   } from 'lucide-react'
import { useWebSocket } from '@/hooks/use-web-socket'
import { TradingAPI } from '@/features/exchanges/Blofin/api/trading'

interface HedgePosition {
  asset: string
  size: number
  hedgeRatio: number
  type: 'options' | 'futures' | 'spot'
  cost: number
  protection: number
  status: 'active' | 'pending' | 'closing'
}

interface WhaleActivity {
  address: string
  action: 'accumulating' | 'distributing'
  volume: number
  impact: number
  confidence: number
}

export function WhaleHedgeManager() {
  const [hedgePositions, setHedgePositions] = useState<HedgePosition[]>([])
  const [whaleActivities, setWhaleActivities] = useState<WhaleActivity[]>([])
  const tradingAPI = new TradingAPI()

  useWebSocket({
    url: 'ws://risk-management-service:5000/whale-activity',
    onMessage: (msg) => {
      const activity = JSON.parse(msg as string)
      handleWhaleActivity(activity)
    }
  })

  const handleWhaleActivity = (activity: WhaleActivity) => {
    setWhaleActivities(prev => [activity, ...prev].slice(0, 5))
    
    if (activity.impact > 0.8 && activity.confidence > 75) {
      deployHedge(activity)
    }
  }

  const deployHedge = async (activity: WhaleActivity) => {
    const hedgeAmount = calculateHedgeSize(activity)
    
    try {
      const order = await tradingAPI.placeOrder({
        instId: 'BTC-USDT-SWAP',
        side: activity.action === 'accumulating' ? 'sell' : 'buy',
        orderType: 'market',
        size: hedgeAmount.toString(),
        marginMode: 'cross',
        positionSide: 'net'
      })

      setHedgePositions(prev => [...prev, {
        asset: 'BTC',
        size: hedgeAmount,
        hedgeRatio: activity.impact * 100,
        type: 'futures',
        cost: activity.volume * activity.impact,
        protection: activity.volume,
        status: 'active'
      }])
    } catch (error) {
      console.error('Hedge deployment failed:', error)
    }
  }

  const calculateHedgeSize = (activity: WhaleActivity) => {
    return activity.volume * activity.impact * 0.5 // Dynamic sizing based on impact
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Whale Activity Hedge Manager
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Active Hedges */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Active Hedges</h3>
            <div className="space-y-3">
              {hedgePositions.map((position, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{position.asset}</span>
                      <Badge variant={position.status === 'active' ? 'success' : 'warning'}>
                        {position.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Protection: ${position.protection.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {position.hedgeRatio.toFixed(1)}% Hedged
                    </div>
                    <div className="text-sm text-gray-500">
                      Cost: ${position.cost.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Whale Activity */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Recent Whale Activity</h3>
            <div className="space-y-3">
              {whaleActivities.map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                  <Fish className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate w-24">
                          {activity.address.slice(0, 6)}...{activity.address.slice(-4)}
                        </span>
                        <Badge variant={activity.action === 'accumulating' ? 'success' : 'destructive'}>
                          {activity.action}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Volume: ${activity.volume.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      Impact: {(activity.impact * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-500">
                      Confidence: {activity.confidence}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}