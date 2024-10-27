import { Input } from "@/features/analytics/components/ui/input"
import { useState } from "react"
import { OCOOrder } from "../types/trading"
import { Label } from "@/features/shared/ui/label"
import { Button } from "@/features/shared/ui/button"

interface OCOOrderFormProps {
    symbol: string
    currentPrice: number
    onSubmit: (order: OCOOrder) => Promise<void>
  }

export function OCOOrderForm({ 
    symbol, 
    currentPrice, 
    onSubmit 
  }: OCOOrderFormProps) {
    const [takeProfit, setTakeProfit] = useState('')
    const [stopLoss, setStopLoss] = useState('')
    const [quantity, setQuantity] = useState('')
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        await onSubmit({
          type: 'oco',
          symbol,
          currentPrice,
          takeProfit: Number(takeProfit),
          stopLoss: Number(stopLoss),
          size: Number(quantity),
          marketType: 'spot', // or another appropriate value
          positionSide: 'long', // or another appropriate value
          orderDirection: 'buy' // or another appropriate value
        })
      } catch (error) {
        console.error('Failed to place OCO order:', error)
      }
    }
  
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label>Quantity</Label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min={0}
            step="0.001"
          />
        </div>
  
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Take Profit</Label>
            <Input
              type="number"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              min={0}
              step="0.01"
            />
          </div>
          <div className="space-y-2">
            <Label>Stop Loss</Label>
            <Input
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              min={0}
              step="0.01"
            />
          </div>
        </div>
  
        <Button type="submit" className="w-full">
          Place OCO Order
        </Button>
      </form>
    )
  }