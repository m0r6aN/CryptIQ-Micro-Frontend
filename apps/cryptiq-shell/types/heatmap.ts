// features/trading/types/heatmap.ts
export interface HeatMapColorScale {
    value: number
    color: string
  }
  
  export interface HeatMapProps<T = any> {
    data: T[]
    xAxis: keyof T
    yAxis: keyof T
    value: keyof T
    colorScale: HeatMapColorScale[]
    width?: number
    height?: number
    tooltip?: boolean
    onCellClick?: (value: T) => void
    className?: string
  }
  