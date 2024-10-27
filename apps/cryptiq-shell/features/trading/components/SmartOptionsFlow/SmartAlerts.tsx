// features/trading/components/SmartOptionsFlow/SmartAlerts.tsx

import { Alert, AlertDescription, AlertTitle } from "@/features/shared/ui/alert"
import { Signal } from "../../types/trading"
import { Badge } from "@/features/shared/ui/badge"

type OptionsAlert = {
    id?: string
    title: string
    description: string
    severity: 'default' | 'info' | 'warning' | 'error'
    timestamp: Date
  }
  
  type DisplayAlert = OptionsAlert & {
    timeframe?: string
    price?: number
    stopLoss?: number
    takeProfits?: number[]
    confidence?: number
    strength?: number
  }

  export function SmartAlerts({ 
    alerts,
    signals 
  }: { 
    alerts?: OptionsAlert[]
    signals?: Signal[] 
  }) {
    const items: DisplayAlert[] = alerts || signals?.map(s => ({
      id: s.id,
      title: s.title || `${s.symbol} ${s.orderDirection} Signal`,
      description: s.message || s.description,
      severity: s.type || (s.strength >= 4 ? 'info' : 'default'),
      timestamp: s.timestamp,
      price: s.price,
      stopLoss: s.stopLoss,
      takeProfits: s.takeProfit,
      strength: s.strength,
      timeframe: s.timeframe,
      confidence: s.confidence
    })) || []
  
    return (
      <div className="space-y-3">
        {items.map((item) => (
          <Alert 
            key={item.id || item.title} 
            variant={item.severity}
            className="flex flex-col gap-2 p-4"
          >
            {/* Rest of the component stays the same */}
            <div className="flex justify-between items-start">
              <AlertTitle className="text-lg font-semibold">{item.title}</AlertTitle>
              {item.timeframe && (
                <Badge variant={item.severity === 'info' ? 'default' : 'secondary'}>
                  {item.timeframe}
                </Badge>
              )}
            </div>
  
            <AlertDescription className="text-sm">{item.description}</AlertDescription>
  
            {item.price && (
              <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                <div>
                  <span className="font-medium">Entry:</span> ${item.price.toFixed(2)}
                </div>
                {item.stopLoss && (
                  <div>
                    <span className="font-medium">Stop Loss:</span> ${item.stopLoss.toFixed(2)}
                  </div>
                )}
              </div>
            )}
  
            {item.takeProfits && item.takeProfits.length > 0 && (
              <div className="mt-1 text-sm">
                <span className="font-medium">Take Profits: </span>
                {item.takeProfits.map((tp, i) => (
                  <span key={i} className="ml-1">TP{i+1}: ${tp.toFixed(2)}</span>
                ))}
              </div>
            )}
  
            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
              {(item.confidence !== undefined || item.strength !== undefined) && (
                <div className="flex items-center gap-2">
                  {item.confidence !== undefined && (
                    <span>Confidence: {(item.confidence * 100).toFixed(0)}%</span>
                  )}
                  {item.strength !== undefined && (
                    <span>Strength: {item.strength}/5</span>
                  )}
                </div>
              )}
              <span>{item.timestamp.toLocaleTimeString()}</span>
            </div>
          </Alert>
        ))}
      </div>
    )
  }