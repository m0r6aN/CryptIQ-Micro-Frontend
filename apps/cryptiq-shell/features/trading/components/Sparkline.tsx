import { useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { format } from 'date-fns'
import * as d3 from 'd3'
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip'
import { 
  Card, 
  CardContent 
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface PricePoint {
  timestamp: number
  price: number
  volume?: number
}

interface SparklineProps {
  data: PricePoint[]
  width?: number
  height?: number
  type?: 'line' | 'candle' | 'area'
  showVolume?: boolean
  showTooltip?: boolean
  showMinMax?: boolean
  animate?: boolean
  className?: string
  gradientColors?: {
    from: string
    to: string
  }
}

export function AdvancedSparkline({
  data,
  width = 200,
  height = 60,
  type = 'line',
  showVolume = true,
  showTooltip = true,
  showMinMax = true,
  animate = true,
  className,
  gradientColors
}: SparklineProps) {
  const { theme } = useTheme()
  const [activePoint, setActivePoint] = useState<PricePoint | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  // Calculate chart dimensions
  const margin = { top: 5, right: 5, bottom: showVolume ? 20 : 5, left: 5 }
  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom
  const volumeHeight = chartHeight * 0.2

  // Memoize scales and line generator
  const {
    xScale,
    yScale,
    volumeScale,
    line,
    area,
    minPrice,
    maxPrice,
    priceChange
  } = useMemo(() => {
    const xScale = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, chartWidth])

    const yScale = d3.scaleLinear()
      .domain([
        d3.min(data, d => d.price) * 0.999,
        d3.max(data, d => d.price) * 1.001
      ])
      .range([chartHeight, 0])

    const volumeScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.volume || 0)])
      .range([0, volumeHeight])

    const line = d3.line<PricePoint>()
      .x((_, i) => xScale(i))
      .y(d => yScale(d.price))
      .curve(d3.curveMonotoneX)

    const area = d3.area<PricePoint>()
      .x((_, i) => xScale(i))
      .y0(chartHeight)
      .y1(d => yScale(d.price))
      .curve(d3.curveMonotoneX)

    const minPrice = d3.min(data, d => d.price)
    const maxPrice = d3.max(data, d => d.price)
    const priceChange = ((data[data.length - 1]?.price || 0) - 
                        (data[0]?.price || 0)) / (data[0]?.price || 1) * 100

    return {
      xScale,
      yScale,
      volumeScale,
      line,
      area,
      minPrice,
      maxPrice,
      priceChange
    }
  }, [data, chartWidth, chartHeight, volumeHeight])

  // Gradient definition
  const gradientId = `sparkline-gradient-${Math.random()}`
  const defaultColors = priceChange >= 0 
    ? { from: '#22c55e', to: '#22c55e33' }
    : { from: '#ef4444', to: '#ef444433' }
  const colors = gradientColors || defaultColors

  // Mouse interaction handlers
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !showTooltip) return

    const svgRect = svgRef.current.getBoundingClientRect()
    const x = e.clientX - svgRect.left - margin.left
    const index = Math.round(xScale.invert(x))
    
    if (index >= 0 && index < data.length) {
      setActivePoint(data[index])
    }
  }

  const handleMouseLeave = () => {
    setActivePoint(null)
  }

  return (
    <div className={cn("relative", className)}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="overflow-visible"
      >
        <defs>
          <linearGradient
            id={gradientId}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={colors.from} stopOpacity={0.5} />
            <stop offset="100%" stopColor={colors.to} stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Area or line path */}
          {type === 'area' ? (
            <motion.path
              initial={animate ? { pathLength: 0 } : undefined}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
              d={area(data) || ''}
              fill={`url(#${gradientId})`}
            />
          ) : (
            <motion.path
              initial={animate ? { pathLength: 0 } : undefined}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1 }}
              d={line(data) || ''}
              fill="none"
              stroke={colors.from}
              strokeWidth={1.5}
            />
          )}

          {/* Volume bars */}
          {showVolume && data.map((d, i) => (
            <motion.rect
              key={i}
              initial={{ height: 0 }}
              animate={{ height: volumeScale(d.volume || 0) }}
              transition={{ duration: 0.5, delay: i * 0.01 }}
              x={xScale(i) - 1}
              y={chartHeight}
              width={2}
              fill={colors.from}
              opacity={0.3}
            />
          ))}

          {/* Min/Max indicators */}
          {showMinMax && (
            <>
              <g transform={`translate(0,${yScale(maxPrice)})`}>
                <line
                  x1={-3}
                  x2={3}
                  stroke={theme === 'dark' ? 'white' : 'black'}
                  strokeWidth={1}
                />
                <text
                  x={-5}
                  y={-2}
                  textAnchor="end"
                  fontSize={10}
                  fill={theme === 'dark' ? 'white' : 'black'}
                >
                  {maxPrice.toFixed(2)}
                </text>
              </g>
              <g transform={`translate(0,${yScale(minPrice)})`}>
                <line
                  x1={-3}
                  x2={3}
                  stroke={theme === 'dark' ? 'white' : 'black'}
                  strokeWidth={1}
                />
                <text
                  x={-5}
                  y={10}
                  textAnchor="end"
                  fontSize={10}
                  fill={theme === 'dark' ? 'white' : 'black'}
                >
                  {minPrice.toFixed(2)}
                </text>
              </g>
            </>
          )}

          {/* Active point indicator */}
          {activePoint && (
            <g>
              <circle
                cx={xScale(data.findIndex(d => d === activePoint))}
                cy={yScale(activePoint.price)}
                r={4}
                fill={colors.from}
              />
              <line
                x1={xScale(data.findIndex(d => d === activePoint))}
                y1={0}
                x2={xScale(data.findIndex(d => d === activePoint))}
                y2={chartHeight}
                stroke={colors.from}
                strokeWidth={1}
                strokeDasharray="2,2"
                opacity={0.5}
              />
            </g>
          )}
        </g>
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {activePoint && showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bg-background border rounded-lg shadow-lg p-2 text-sm"
            style={{
              left: xScale(data.findIndex(d => d === activePoint)) + margin.left,
              top: yScale(activePoint.price) + margin.top - 40
            }}
          >
            <div className="font-medium">
              ${activePoint.price.toFixed(2)}
            </div>
            <div className="text-muted-foreground text-xs">
              {format(activePoint.timestamp, 'HH:mm:ss')}
            </div>
            {activePoint.volume && (
              <div className="text-xs text-muted-foreground">
                Vol: {activePoint.volume.toLocaleString()}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Candle chart variation
export function CandleSparkline({
  data,
  ...props
}: Omit<SparklineProps, 'type'>) {
  // Implementation of candlestick chart
  // I can show this if you're interested
  return null
}