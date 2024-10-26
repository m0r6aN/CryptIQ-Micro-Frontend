import { useMemo } from 'react'
import { ArrowUp, ArrowDown } from 'lucide-react'
import { PriceDisplayProps } from '../../types/props'

export function PriceDisplay({ currentPrice, previousPrice, decimals = 2 }: PriceDisplayProps) {
  const change = useMemo(() => {
    const diff = currentPrice - previousPrice
    const percent = (diff / previousPrice) * 100
    return {
      value: diff.toFixed(decimals),
      percent: percent.toFixed(2),
      isPositive: diff >= 0
    }
  }, [currentPrice, previousPrice, decimals])

  return (
    <div className="flex items-center gap-1">
      <span className="text-sm font-mono">{currentPrice.toFixed(decimals)}</span>
      <span className={`flex items-center text-xs ${change.isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {change.isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
        {change.percent}%
      </span>
    </div>
  )
}
