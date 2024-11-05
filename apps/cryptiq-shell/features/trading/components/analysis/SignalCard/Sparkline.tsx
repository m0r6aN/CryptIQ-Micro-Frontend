// features/trading/components/SignalCard/Sparkline.tsx
import { memo, useMemo } from 'react'
import { SparklineProps } from '../../types/props'


export const Sparkline = memo(({ 
  data, 
  color,
  height = 48,
  width = 96
}: SparklineProps) => {
  const points = useMemo(() => {
    if (data.length < 2) return ''
    
    const prices = data.map(d => d.price)
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    const range = max - min
    const step = width / (data.length - 1)
    
    return data.map((point, i) => {
      const x = i * step
      const y = height - ((point.price - min) / range) * height
      return `${i === 0 ? 'M' : 'L'} ${x},${y}`
    }).join(' ')
  }, [data, width, height])

  if (data.length < 2) return null

  return (
    <svg 
      width={width} 
      height={height} 
      className="overflow-visible"
    >
      <path
        d={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
})

Sparkline.displayName = 'Sparkline'