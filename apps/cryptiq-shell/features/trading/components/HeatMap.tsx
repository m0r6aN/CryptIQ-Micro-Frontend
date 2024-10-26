// features/trading/components/HeatMap.tsx
import { HeatMapProps } from '@/types/heatmap'
import { Key, useMemo } from 'react'


export function HeatMap<T>({ 
  data,
  xAxis,
  yAxis,
  value,
  colorScale,
  width = 800,
  height = 400,
  tooltip = true,
  onCellClick,
  className = ''
}: HeatMapProps<T>) {
  const uniqueX = useMemo(() => [...new Set(data.map(d => d[xAxis]))], [data, xAxis])
  const uniqueY = useMemo(() => [...new Set(data.map(d => d[yAxis]))], [data, yAxis])
  
  const cellWidth = width / uniqueX.length
  const cellHeight = height / uniqueY.length

  const getColor = (value: number) => {
    const sortedScale = [...colorScale].sort((a, b) => a.value - b.value)
    
    // Find appropriate color range
    for (let i = 1; i < sortedScale.length; i++) {
      if (value <= sortedScale[i].value) {
        const start = sortedScale[i - 1]
        const end = sortedScale[i]
        const ratio = (value - start.value) / (end.value - start.value)
        return interpolateColor(start.color, end.color, ratio)
      }
    }
    return sortedScale[sortedScale.length - 1].color
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg width={width} height={height}>
      {data.map((d, i) => {
          const xPos = uniqueX.indexOf(d[xAxis]) * cellWidth
          const yPos = uniqueY.indexOf(d[yAxis]) * cellHeight
          const cellValue = Number(d[value])

          return (
            <g key={i}>
              <rect
                x={xPos}
                y={yPos}
                width={cellWidth}
                height={cellHeight}
                fill={getColor(cellValue)}
                onClick={() => onCellClick?.(d)}
                className="transition-colors cursor-pointer hover:opacity-80"
                data-tooltip-id="heatmap-tooltip"
                data-tooltip-content={`${d[xAxis]}, ${d[yAxis]}: ${cellValue}`}
              />
              {tooltip && (
                <title>{`${d[xAxis]}, ${d[yAxis]}: ${cellValue}`}</title>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// Helper function to interpolate between colors
function interpolateColor(color1: string, color2: string, ratio: number) {
  const hex1 = color1.replace('#', '')
  const hex2 = color2.replace('#', '')
  
  const r1 = parseInt(hex1.slice(0, 2), 16)
  const g1 = parseInt(hex1.slice(2, 4), 16)
  const b1 = parseInt(hex1.slice(4, 6), 16)
  
  const r2 = parseInt(hex2.slice(0, 2), 16)
  const g2 = parseInt(hex2.slice(2, 4), 16)
  const b2 = parseInt(hex2.slice(4, 6), 16)
  
  const r = Math.round(r1 + (r2 - r1) * ratio)
  const g = Math.round(g1 + (g2 - g1) * ratio)
  const b = Math.round(b1 + (b2 - b1) * ratio)
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}