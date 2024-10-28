"use client"

import { useState } from 'react'

import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Timer, 
} from 'lucide-react'
import { SignalPanelProps } from '../types/props'
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card'
import { Button } from '@/features/shared/ui/button'
import { Skeleton } from '@/features/shared/ui/skeleton'
import { Badge } from '@/features/shared/ui/badge'
import { Signal } from '../types/trading'


export function SignalPanel({ signals, onSignalClick, isLoading }: SignalPanelProps) {
  const [expandedSignal, setExpandedSignal] = useState<string | null>(null)

  const getStrengthColor = (strength: Signal['strength']) => {
    switch (strength) {
      case 1: // Assuming 1 corresponds to 'low'
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 2: // Assuming 2 corresponds to 'medium'
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 3: // Assuming 3 corresponds to 'high'
        return 'bg-green-100 text-green-800 border-green-200'
      // Add more cases if there are more strength levels
    }
  }

  if (isLoading) {
    return <SignalPanelSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Trading Signals
          <Badge variant="secondary">{signals.length} Active</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {signals.map((signal) => (
            <div 
              key={signal.id}
              className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow"
            >
              {/* Signal Header */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{signal.symbol}</span>
                    <Badge 
                      variant="outline"
                      className={getStrengthColor(signal.strength)}
                    >
                      {signal.strength}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    {signal.timeframe}
                  </div>
                </div>
                <Badge 
                  variant={signal.orderDirection === 'buy' ? 'default' : 'secondary'}
                  className={signal.positionSide === 'long' ? 'bg-green-500' : 'bg-red-500'}
                >
                  {signal.orderDirection === 'buy' ? (
                    <div className="flex items-center gap-1">
                      {signal.positionSide === 'long' ? 
                        <TrendingUp className="h-4 w-4" /> : 
                        <TrendingDown className="h-4 w-4" />
                      }
                      {signal.positionSide.toUpperCase()} Entry
                    </div>
                  ) : 'Exit'}
                </Badge>
              </div>

              {/* Signal Details */}
              <div className="text-sm">{signal.description}</div>
              
              {/* Expanded Content */}
              <div className={`grid grid-cols-2 gap-2 ${
                expandedSignal === signal.id ? '' : 'hidden'
              }`}>
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Entry Price</div>
                  <div className="font-medium">${signal.price.toLocaleString()}</div>
                </div>
                {signal.stopLoss && (
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Stop Loss</div>
                    <div className="font-medium text-red-500">
                      ${signal.stopLoss.toLocaleString()}
                    </div>
                  </div>
                )}
                {signal.takeProfit && (
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Take Profit</div>
                    <div className="font-medium text-green-500">
                      ${signal.takeProfit.toLocaleString()}
                    </div>
                  </div>
                )}
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">Confidence</div>
                  <div className="font-medium">{signal.confidence}%</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExpandedSignal(
                    expandedSignal === signal.id ? null : signal.id ?? null
                  )}
                  className="flex-1"
                >
                  {expandedSignal === signal.id ? 'Less' : 'More'} Info
                </Button>
                {onSignalClick && (
                  <Button
                    size="sm"
                    onClick={() => onSignalClick(signal)}
                    className="flex-1"
                  >
                    Take Signal
                  </Button>
                )}
              </div>
            </div>
          ))}
          {signals.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <div>No active signals</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function SignalPanelSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}