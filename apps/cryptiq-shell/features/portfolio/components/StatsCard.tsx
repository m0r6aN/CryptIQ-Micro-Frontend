import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

// StatsCard.tsx
interface StatsCardProps {
  title: string
  value: string
  change: number
  icon: React.ReactNode
}

export function StatsCard({ title, value, change, icon }: StatsCardProps) {
  const isPositive = change >= 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className={`flex items-center text-sm ${
          isPositive ? 'text-green-500' : 'text-red-500'
        }`}>
          {isPositive ? (
            <ArrowUpRight className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDownRight className="h-4 w-4 mr-1" />
          )}
          {Math.abs(change).toFixed(2)}%
        </div>
      </CardContent>
    </Card>
  )
}