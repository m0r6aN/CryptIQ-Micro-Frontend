import { useState, useEffect } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent } from '@/features/shared/ui/card'
import { Button } from '@/features/shared/ui/button'
import { Label } from '@/features/shared/ui/label'
import { Slider } from '@/features/shared/ui/slider'
import { Input } from '@/features/shared/ui/input'
import { Alert, AlertDescription } from '@/features/shared/ui/alert'

export type OrderType = 'market' | 'limit' | 'conditional'
export type OrderSide = 'long' | 'short'

export type Order = {
  symbol: string
  type: OrderType
  side: OrderSide
  size: number
  price?: number
  leverage?: number
  stopLoss?: number
  takeProfit?: number
}

export interface OrderFormProps {
  type: OrderType
  onSubmit: (order: Order) => Promise<void>
  isSubmitting: boolean
  error: string | null
}

export default function OrderForm({ type, onSubmit, isSubmitting, error }: OrderFormProps) {
  const { toast } = useToast()
  const [side, setSide] = useState<OrderSide>('long')
  const [size, setSize] = useState('')
  const [price, setPrice] = useState('')
  const [leverage, setLeverage] = useState(1)
  const [stopLoss, setStopLoss] = useState('')
  const [takeProfit, setTakeProfit] = useState('')
  const [symbol] = useState('BTC-USDT') // Could be made dynamic later
  const [localError, setLocalError] = useState<string | null>(null)

  // Reset form when type changes
  useEffect(() => {
    setSize('')
    setPrice('')
    setStopLoss('')
    setTakeProfit('')
    setLocalError(null)
  }, [type])

  const validateForm = (): boolean => {
    if (!size || Number(size) <= 0) {
      setLocalError('Please enter a valid size')
      return false
    }

    if (type !== 'market' && (!price || Number(price) <= 0)) {
      setLocalError('Please enter a valid price')
      return false
    }

    if (stopLoss && Number(stopLoss) <= 0) {
      setLocalError('Please enter a valid stop loss')
      return false
    }

    if (takeProfit && Number(takeProfit) <= 0) {
      setLocalError('Please enter a valid take profit')
      return false
    }

    setLocalError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await onSubmit({
        symbol,
        type,
        side,
        size: Number(size),
        price: price ? Number(price) : undefined,
        leverage,
        stopLoss: stopLoss ? Number(stopLoss) : undefined,
        takeProfit: takeProfit ? Number(takeProfit) : undefined
      })

      toast({
        title: "Order Submitted",
        description: `${side.toUpperCase()} ${type} order placed successfully`
      })

      // Reset form on success
      setSize('')
      setPrice('')
      setStopLoss('')
      setTakeProfit('')
      
    } catch (err) {
      toast({
        title: "Order Failed",
        description: err instanceof Error ? err.message : "Failed to place order",
        variant: "destructive"
      })
    }
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Side Selection */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={side === 'long' ? 'default' : 'outline'}
              onClick={() => setSide('long')}
              className={side === 'long' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              <ArrowUp className="mr-2 h-4 w-4" />
              Long
            </Button>
            <Button
              type="button"
              variant={side === 'short' ? 'destructive' : 'outline'}
              onClick={() => setSide('short')}
            >
              <ArrowDown className="mr-2 h-4 w-4" />
              Short
            </Button>
          </div>

          {/* Leverage Slider */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Leverage</Label>
              <span className="text-sm font-medium">{leverage}x</span>
            </div>
            <Slider
              value={[leverage]}
              onValueChange={([value]) => setLeverage(value)}
              min={1}
              max={100}
              step={1}
              className="py-4"
            />
          </div>

          {/* Size Input */}
          <div className="space-y-2">
            <Label htmlFor="size">Size (USDT)</Label>
            <Input
              id="size"
              type="number"
              placeholder="Enter size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          {/* Price Input (for limit and conditional orders) */}
          {type !== 'market' && (
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          )}

          {/* Stop Loss and Take Profit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stopLoss">Stop Loss</Label>
              <Input
                id="stopLoss"
                type="number"
                placeholder="Optional"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="takeProfit">Take Profit</Label>
              <Input
                id="takeProfit"
                type="number"
                placeholder="Optional"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Error Display */}
          {(error || localError) && (
            <Alert variant="error">
              <AlertDescription>
                {error || localError}
              </AlertDescription>
            </Alert>
          )}
          

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? 'Placing Order...' 
              : `Place ${side.toUpperCase()} ${type.toUpperCase()} Order`
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}