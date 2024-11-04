import { useState } from "react"
import { TrailingStopOrder } from "../types/trading"
import { Label } from "@/features/shared/ui/label"
import { Slider } from "@/features/shared/ui/slider"
import { Input } from "@/features/shared/ui/input"
import { Button } from "@/features/shared/ui/button"

interface TrailingStopFormProps {
    symbol: string
    currentPrice: number
    onSubmit: (order: TrailingStopOrder) => Promise<void>
  }
  
  export function TrailingStopForm({ 
    symbol, 
    currentPrice, 
    onSubmit 
  }: TrailingStopFormProps) {
    const [callbackRate, setCallbackRate] = useState(1)
    const [activation, setActivation] = useState(currentPrice)
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        await onSubmit({
          type: 'trailingStop',
          symbol,
          currentPrice,
          callbackRate,
          activationPrice: activation
        })
      } catch (error) {
        console.error('Failed to place trailing stop:', error)
      }
    }
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Callback Rate (%)</Label>
          <div className="space-y-2">
            <Slider
              value={[callbackRate]}
              onValueChange={([value]) => setCallbackRate(value)}
              min={0.1}
              max={5}
              step={0.1}
            />
            <div className="text-right text-sm text-muted-foreground">
              {callbackRate.toFixed(1)}%
            </div>
          </div>
        </div>
  
        <div className="space-y-2">
          <Label>Activation Price</Label>
          <Input
            type="number"
            value={activation}
            onChange={(e) => setActivation(Number(e.target.value))}
            min={0}
            step="0.01"
          />
        </div>
  
        <Button type="submit" className="w-full">
          Place Trailing Stop
        </Button>
      </form>
    )
  }