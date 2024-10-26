// features/trading/components/SmartOptionsFlow/StrikePriceHeatMap.tsx
import { Card } from "@/components/ui/card"
import { StrikeData } from "../../types/options"
import { HeatMap } from "../HeatMap"
import { HeatMapColorScale, HeatMapProps } from "@/types/heatmap"


export function StrikePriceHeatMap({ data }: { data: StrikeData[] }) {
  const colorScale: HeatMapColorScale[] = [
    { value: 0, color: '#f7fbff' },
    { value: 50, color: '#6baed6' },
    { value: 100, color: '#08519c' }
  ]

  const heatMapProps: HeatMapProps = {
    data,
    xAxis: 'strike',
    yAxis: 'expiry',
    value: 'volume',
    colorScale
  }

  return (
    <Card className="p-4">
      <HeatMap {...heatMapProps} />
    </Card>
  )
}