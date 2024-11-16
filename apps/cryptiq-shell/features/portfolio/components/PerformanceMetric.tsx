// features/portfolio/components/PerformanceMetric.tsx
import { LucideIcon } from 'lucide-react'

interface PerformanceMetricProps {
  label: string
  value: number
  icon: LucideIcon
  format?: 'number' | 'percent'
}

export function PerformanceMetric({ 
  label, 
  value, 
  icon: Icon, 
  format = 'number' 
}: PerformanceMetricProps) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
      <Icon className="h-8 w-8 text-blue-500" />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold">
          {format === 'percent' ? `${value.toFixed(1)}%` : value.toFixed(2)}
        </p>
      </div>
    </div>
  )
}