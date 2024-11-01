import React, { useEffect, useState } from 'react'
import { Palm, Waves, MonitorCheck, Rocket } from 'lucide-react'
import { Card, CardTitle, CardHeader, CardContent } from '@/features/shared/ui/card'
import { Progress } from '@/features/shared/ui/progress'

export function IslandProgressDashboard() {
  const [metrics, setMetrics] = useState<BeachFundMetrics>()
  const [analysis, setAnalysis] = useState<ProfitAnalysis>()

  useEffect(() => {
    // Real-time WebSocket updates
    const ws = new WebSocket('ws://your-profit-tracker/metrics')
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      updateMetrics(data)
    }

    return () => ws.close()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Island Progress Card */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palm className="h-6 w-6" />
            Island Progress Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">
                  Progress to Paradise 🏝️
                </span>
                <span className="text-sm font-medium">
                  ${metrics?.total.toLocaleString()} / $1,000,000
                </span>
              </div>
              <Progress 
                value={metrics?.total / 10000} 
                className="h-4"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <StatCard
                title="Next Milestone"
                value={metrics?.nextMilestone.name}
                icon={<Rocket className="h-4 w-4" />}
                progress={metrics?.nextMilestone.progress}
              />
              <StatCard
                title="Daily Profit"
                value={`$${analysis?.dailyProfit.toLocaleString()}`}
                icon={<MonitorCheck className="h-4 w-4" />}
                trend={analysis?.profitTrend}
              />
              <StatCard
                title="Island ETA"
                value={metrics?.projectedIslandDate.toLocaleDateString()}
                icon={<Waves className="h-4 w-4" />}
                countdown={true}
              />
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analysis?.profitHistory}>
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.2} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* More detailed cards... */}
    </div>
  )
}