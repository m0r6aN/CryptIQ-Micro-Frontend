import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { TrendingUp, TrendingDown, AlertCircle, BarChart2 } from 'lucide-react'

type Insight = {
  type: 'trend' | 'risk' | 'opportunity' | 'alert'
  title: string
  description: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high'
}

export default function AIInsights() {
  // TODO: Connect with AI service for real insights
  const insights: Insight[] = [
    {
      type: 'trend',
      title: 'Bullish Momentum',
      description: 'BTC showing strong buy signals on 4H timeframe',
      timestamp: new Date(),
      severity: 'high'
    }
  ]

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="h-4 w-4" />
      case 'risk':
        return <AlertCircle className="h-4 w-4" />
      case 'opportunity':
        return <BarChart2 className="h-4 w-4" />
      case 'alert':
        return <TrendingDown className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: Insight['severity']) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-50 border-blue-200'
      case 'medium':
        return 'bg-yellow-50 border-yellow-200'
      case 'high':
        return 'bg-red-50 border-red-200'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Market Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <Alert 
            key={index}
            className={`${getSeverityColor(insight.severity)} border`}
          >
            <div className="flex items-center gap-2">
              {getInsightIcon(insight.type)}
              <AlertTitle>{insight.title}</AlertTitle>
            </div>
            <AlertDescription className="mt-2">
              {insight.description}
            </AlertDescription>
          </Alert>
        ))}
      </CardContent>
    </Card>
  )
}