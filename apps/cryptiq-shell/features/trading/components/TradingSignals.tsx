"use client"

import React from 'react'
import { useSignalDetection } from '@/features/trading/hooks/useSignalDetection'
import { Activity, TrendingUp, TrendingDown, AlertTriangle, Timer } from 'lucide-react'
import type { Signal } from '@/features/trading/types/trading'
import { Card, CardContent, CardTitle, CardHeader } from '@/features/shared/ui/card'
import { Badge } from '@/features/shared/ui/badge'
import { Button } from '@/features/shared/ui/button'

interface TradingSignalsProps {
  onSignalClick?: (signal: Signal) => Promise<void>
}

export function TradingSignals({ onSignalClick }: TradingSignalsProps) {
  const { signals, hotZones, isReady } = useSignalDetection({
    symbols: ['ETH-USDT', 'BTC-USDT', 'SOL-USDT'],
    minStrength: 0.7,
    minConfidence: 0.8
  })

  const handleExecuteTrade = (signal: Signal) => {
    onSignalClick?.(signal)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {/* Active Signals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Active Signals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {signals.map(signal => (
              <div 
                key={signal.id} 
                className={`p-4 rounded-lg border ${
                  signal.strength >= 4 ? 'bg-primary/10' : 'bg-background'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{signal.symbol}</span>
                      <Badge variant={signal.direction === 'long' ? 'default' : 'destructive'}>
                        {signal.direction.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        Strength: {signal.strength}/5
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {signal.description}
                    </p>
                  </div>
                  {signal.strength >= 4 && (
                    <AlertTriangle className="h-5 w-5 text-warning" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 my-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Entry:</span>{' '}
                    ${signal.price.toFixed(2)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Stop Loss:</span>{' '}
                    ${signal.stopLoss?.toFixed(2)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">TP1:</span>{' '}
                    ${signal.takeProfit?.[0].toFixed(2)}
                  </div>
                  <div>
                    <span className="text-muted-foreground">TP2:</span>{' '}
                    ${signal.takeProfit?.[1].toFixed(2)}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Timer className="h-4 w-4" />
                    {new Date(signal.expiryTime).toLocaleTimeString()}
                  </div>
                  <Button 
                    size="sm"
                    variant={signal.strength >= 4 ? 'default' : 'outline'}
                    onClick={() => handleExecuteTrade(signal)}
                  >
                    {signal.direction === 'long' ? 
                      <TrendingUp className="h-4 w-4 mr-2" /> : 
                      <TrendingDown className="h-4 w-4 mr-2" />}
                    Execute Trade
                  </Button>
                </div>
              </div>
            ))}
            {signals.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No active signals
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hot Zones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Hot Zones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hotZones.map((zone, index) => (
              <div 
                key={`${zone.price}-${index}`} 
                className="p-4 rounded-lg border bg-background"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">${zone.price.toFixed(2)}</span>
                  <Badge variant="secondary">
                    {zone.signals.length} Signals
                  </Badge>
                </div>
                <div className="space-y-2">
                  {zone.signals.slice(0, 3).map((signal, idx) => (
                    <div 
                      key={signal.id} 
                      className="text-sm flex justify-between items-center"
                    >
                      <span className="text-muted-foreground">
                        {signal.description}
                      </span>
                      <Badge variant="outline">
                        {signal.strength}/5
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {hotZones.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No hot zones detected
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}