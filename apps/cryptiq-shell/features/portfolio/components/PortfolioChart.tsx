import { Asset } from '../types/portfolio'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Area } from 'recharts'

type PortfolioChartProps = {
  assets: Asset[]
}

export function PortfolioChart({ assets }: PortfolioChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={assets}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.2} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}