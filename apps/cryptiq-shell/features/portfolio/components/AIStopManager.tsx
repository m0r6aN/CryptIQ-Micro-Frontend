import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card'
import { Badge } from '@/features/shared/ui/badge'
import { Button } from '@/features/shared/ui/button'
import { Slider } from '@/features/shared/ui/slider'
import { Brain, Zap, TrendingUp, ChevronUp, ChevronDown } from 'lucide-react'
import { useWebSocket } from '@/hooks/use-web-socket'

interface AIStopConfig {
  asset: string
  initialStop: number
  currentStop: number
  marketPrice: number
  profitTarget: number
  confidence: number
  volatilityScore: number
  recommendedAdjustment: number
  reason: string
}

export function AIStopManager() {
  const [stopConfigs, setStopConfigs] = useState<AIStopConfig[]>([])
  const [autoAdjust, setAutoAdjust] = useState(true)

  useWebSocket({
    url: 'ws://market-analysis-service:5000/ai-stops',
    onMessage: (msg) => {
      const configs = JSON.parse(msg as string)
      if (autoAdjust) {
        handleAutoAdjustments(configs)
      } else {
        setStopConfigs(configs)
      }
    }
  })

  const handleAutoAdjustments = (configs: AIStopConfig[]) => {
    const adjustedConfigs = configs.map(config => ({
      ...config,
      currentStop: config.recommendedAdjustment
    })) // Added closing brace and comma
    setStopConfigs(adjustedConfigs)
  }

  const adjustStop = (asset: string, adjustment: number) => {
    setStopConfigs(prev => 
      prev.map(config => 
        config.asset === asset 
          ? { ...config, currentStop: adjustment }
          : config
      )
    )
  }

  const getStopColor = (config: AIStopConfig) => {
    const change = ((config.currentStop - config.initialStop) / config.initialStop) * 100
    return change > 0 ? 'text-green-500' : 'text-red-500'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Stop Manager
          </CardTitle>
          <Button
            variant={autoAdjust ? "default" : "outline"}
            onClick={() => setAutoAdjust(!autoAdjust)}
          >
            <Zap className={`w-4 h-4 mr-2 ${autoAdjust ? "text-yellow-400" : ""}`} />
            Auto Adjust
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stopConfigs.map((config, i) => (
            <div key={i} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{config.asset}</span>
                  <Badge variant={config.confidence > 70 ? "success" : "warning"}>
                    {config.confidence}% Confidence
                  </Badge>
                </div>
                <div className={`flex items-center ${getStopColor(config)}`}>
                  {config.currentStop > config.initialStop ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  ${config.currentStop.toFixed(2)}
                </div>
              </div>

              <div className="flex gap-4 text-sm text-gray-500">
                <div>Market: ${config.marketPrice.toFixed(2)}</div>
                <div>Target: ${config.profitTarget.toFixed(2)}</div>
                <div>Vol Score: {config.volatilityScore}</div>
              </div>

              {!autoAdjust && (
                <div className="pt-2">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Adjust Stop</span>
                    <span>AI Recommends: ${config.recommendedAdjustment.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[config.currentStop]}
                    min={config.initialStop * 0.8}
                    max={config.marketPrice * 0.95}
                    step={0.01}
                    onValueChange={([value]) => adjustStop(config.asset, value)}
                  />
                </div>
              )}

              <div className="text-sm text-gray-600 italic">
                {config.reason}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}