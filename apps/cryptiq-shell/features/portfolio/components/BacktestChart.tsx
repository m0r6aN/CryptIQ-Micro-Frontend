import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'
import type { BacktestResult } from '../types/strategy'

interface BacktestChartProps {
  data: BacktestResult[]
}

export function BacktestChart({ data }: BacktestChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <XAxis 
          dataKey="timestamp" 
          tickFormatter={(unix) => new Date(unix).toLocaleDateString()}
        />
        <YAxis />
        <Tooltip 
          labelFormatter={(unix) => new Date(unix).toLocaleString()}
          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
        />
        <Line 
          type="monotone" 
          dataKey="portfolioValue" 
          stroke="#3b82f6" 
          name="Portfolio"
        />
        <Line 
          type="monotone" 
          dataKey="benchmark" 
          stroke="#6b7280" 
          strokeDasharray="3 3" 
          name="Benchmark"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}