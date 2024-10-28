import React, { useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { format } from 'date-fns'
import { scaleLinear } from 'd3-scale'
import { min, max } from 'd3-array'
import { Line, line, area, curveMonotoneX } from 'd3-shape'

interface PricePoint {
  timestamp: number
  price: number
  volume?: number
  dexPrices: {
    [key: string]: number
  }
  opportunity?: {
    profit: number
    path: string[]
  }
}

interface ArbitrageSparklineProps {
  data: PricePoint[]
  width?: number
  height?: number
  showVolume?: boolean
  className?: string
}

export default function ArbitrageSparkline({
  data,
  width = 400,
  height = 100,
  showVolume = true,
  className
}: ArbitrageSparklineProps) {
  const { theme } = useTheme()
  const [activePoint, setActivePoint] = useState<PricePoint | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const margin = { top: 10, right: 10, bottom: showVolume ? 20 : 10, left: 10 }
  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom
  const volumeHeight = chartHeight * 0.2

  const {
    xScale,
    yScale,
    volumeScale,
    lineGenerators,
    opportunityPaths,
    maxProfit
  } = useMemo(() => {
    const dexes = Object.keys(data[0]?.dexPrices || {})
    
    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([0, chartWidth])

    const allPrices = data.flatMap(d => Object.values(d.dexPrices))
    const yScale = scaleLinear()
      .domain([min(allPrices) ?? 0, max(allPrices) ?? 0])
      .range([chartHeight, 0])

    const volumeScale = scaleLinear()
      .domain([0, max(data, d => d.volume ?? 0) ?? 0])
      .range([0, volumeHeight])

    const lineGenerators: Record<string, Line<PricePoint>> = dexes.reduce((acc, dex) => ({
      ...acc,
      [dex]: line<PricePoint>()
        .x((_, i) => xScale(i))
        .y(d => yScale(d.dexPrices[dex]))
        .curve(curveMonotoneX)
    }), {})

    const opportunityPaths = data.filter(d => d.opportunity).map(d => ({
      points: d.opportunity!.path.map((dex, i, arr) => {
        const nextDex = arr[i + 1]
        if (!nextDex) return null
        return {
          x1: xScale(data.indexOf(d)),
          y1: yScale(d.dexPrices[dex]),
          x2: xScale(data.indexOf(d)),
          y2: yScale(d.dexPrices[nextDex])
        }
      }).filter(Boolean),
      profit: d.opportunity!.profit
    }))

    const maxProfit = max(data.map(d => d.opportunity?.profit ?? 0)) ?? 0

    return {
      xScale,
      yScale,
      volumeScale,
      lineGenerators,
      opportunityPaths,
      maxProfit
    }
  }, [data, chartWidth, chartHeight, volumeHeight])

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return
    const svgRect = svgRef.current.getBoundingClientRect()
    const x = e.clientX - svgRect.left - margin.left
    const index = Math.round(xScale.invert(x))
    
    if (index >= 0 && index < data.length) {
      setActivePoint(data[index])
    }
  }

  return (
    <div className={className}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setActivePoint(null)}
        className="overflow-visible"
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Price lines for each DEX */}
          {Object.entries(lineGenerators).map(([dex, generator]: [string, Line<PricePoint>], i) => (
            <motion.path
              key={dex}
              d={generator(data) || ''}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ duration: 1, delay: i * 0.2 }}
              fill="none"
              stroke={`hsl(${i * 40}, 70%, 50%)`}
              strokeWidth={1.5}
              className="hover:opacity-100 transition-opacity"
            />
          ))}

          {/* Arbitrage opportunity paths */}
          <AnimatePresence>
            {opportunityPaths.map((opportunity, i) => (
              <g key={i}>
                {opportunity.points.map((point, j) => point && (
                  <motion.line
                    key={j}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.8 }}
                    exit={{ opacity: 0 }}
                    x1={point.x1}
                    y1={point.y1}
                    x2={point.x2}
                    y2={point.y2}
                    stroke={`hsl(${(opportunity.profit / maxProfit) * 120}, 100%, 50%)`}
                    strokeWidth={2}
                    strokeDasharray="4,4"
                    className="animate-pulse"
                  />
                ))}
              </g>
            ))}
          </AnimatePresence>

          {/* Volume bars */}
          {showVolume && data.map((d, i) => (
            <motion.rect
              key={i}
              initial={{ height: 0 }}
              animate={{ height: volumeScale(d.volume ?? 0) }}
              transition={{ duration: 0.5, delay: i * 0.01 }}
              x={xScale(i) - 1}
              y={chartHeight}
              width={2}
              fill={theme === 'dark' ? 'white' : 'black'}
              opacity={0.2}
            />
          ))}

          {/* Active point indicators */}
          {activePoint && (
            <g>
              {Object.entries(activePoint.dexPrices).map(([dex, price], i) => (
                <circle
                  key={dex}
                  cx={xScale(data.indexOf(activePoint))}
                  cy={yScale(price)}
                  r={4}
                  fill={`hsl(${i * 40}, 70%, 50%)`}
                />
              ))}
              {activePoint.opportunity && (
                <circle
                  cx={xScale(data.indexOf(activePoint))}
                  cy={yScale(Object.values(activePoint.dexPrices)[0])}
                  r={8}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth={2}
                  className="animate-ping"
                />
              )}
            </g>
          )}
        </g>
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {activePoint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bg-background border rounded-lg shadow-lg p-2 text-sm"
            style={{
              left: xScale(data.indexOf(activePoint)) + margin.left,
              top: margin.top - 40
            }}
          >
            <div className="space-y-1">
              {Object.entries(activePoint.dexPrices).map(([dex, price], i) => (
                <div key={dex} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: `hsl(${i * 40}, 70%, 50%)` }}
                  />
                  <span>{dex}: ${price.toFixed(2)}</span>
                </div>
              ))}
              {activePoint.opportunity && (
                <div className="text-green-500 font-medium mt-1">
                  Opportunity: ${activePoint.opportunity.profit.toFixed(2)}
                </div>
              )}
              <div className="text-muted-foreground text-xs">
                {format(activePoint.timestamp, 'HH:mm:ss')}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}