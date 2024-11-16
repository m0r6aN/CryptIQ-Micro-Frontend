import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'
import { Brain, Zap } from 'lucide-react'
import { Card, CardContent } from '@/features/shared/ui/card'

export default function OptimizationMatrix() {
  const [aiSignals, setAiSignals] = useState<any[]>([])
  const [optimizationState, setOptimizationState] = useState('idle')

  useEffect(() => {
    const ws = new WebSocket('ws://ai-optimization-service:5000/matrix-stream')
    
    ws.onmessage = (event) => {
        const signal = JSON.parse(event.data)
        setAiSignals(prev => [...prev.slice(-20), signal])
    }

    return () => ws.close()
  }, [])

  return (
    <div className="w-full h-64">
      <Card className="bg-black/5 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium">AI Optimization Matrix</span>
            {optimizationState === 'running' && (
              <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
            )}
          </div>
          
          <LineChart width={600} height={180} data={aiSignals}>
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="optimizationScore" stroke="#3b82f6" />
          </LineChart>
        </CardContent>
      </Card>
    </div>
  )
}