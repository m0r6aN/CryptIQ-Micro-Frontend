import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { AlertCircle, PlayCircle, StopCircle, RefreshCw, Zap } from 'lucide-react'
import { Card, CardContent, CardTitle, CardHeader } from 'features/shared/ui/card'
import { Input } from 'features/shared/ui/input'
import { Button } from 'features/shared/ui/button'
import { Progress } from 'features/shared/ui/progress'
import { Alert, AlertDescription } from 'features/shared/ui/alert'

interface SimulationParams {
  route: string[]
  amount: number
  slippage: number
  speed: 'fastest' | 'balanced' | 'cheapest'
}

interface SimulationResult {
  timestamp: number
  executionPrice: number
  marketPrice: number
  slippage: number
  gasCost: number
  profitLoss: number
  status: 'success' | 'failure'
  reason?: string
}

interface SimulationMetrics {
  avgExecutionTime: number
  successRate: number
  avgSlippage: number
  totalGasCost: number
  netProfitLoss: number
  worstSlippage: number
  bestExecution: number
}

export function TradeSimulator() {
  const [isSimulating, setIsSimulating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [iterations, setIterations] = useState(10)
  const [results, setResults] = useState<SimulationResult[]>([])
  const [metrics, setMetrics] = useState<SimulationMetrics>({
    avgExecutionTime: 0,
    successRate: 0,
    avgSlippage: 0,
    totalGasCost: 0,
    netProfitLoss: 0,
    worstSlippage: 0,
    bestExecution: 0
  })

  const runSimulation = async (params: SimulationParams) => {
    setIsSimulating(true)
    setProgress(0)
    setResults([])

    try {
      for (let i = 0; i < iterations; i++) {
        const result = await simulateExecution(params)
        setResults(prev => [...prev, result])
        setProgress(((i + 1) / iterations) * 100)
        updateMetrics([...results, result])
      }
    } catch (error) {
      console.error('Simulation failed:', error)
    } finally {
      setIsSimulating(false)
    }
  }

  const simulateExecution = async (params: SimulationParams): Promise<SimulationResult> => {
    try {
      const response = await fetch('trading-service:5000/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      })

      if (!response.ok) throw new Error('Simulation request failed')
      return await response.json()
    } catch (error) {
      console.error('Execution simulation failed:', error)
      throw error
    }
  }

  const updateMetrics = (results: SimulationResult[]) => {
    const successful = results.filter(r => r.status === 'success')
    
    setMetrics({
      avgExecutionTime: results.reduce((acc, r) => acc + r.executionPrice, 0) / results.length,
      successRate: (successful.length / results.length) * 100,
      avgSlippage: results.reduce((acc, r) => acc + r.slippage, 0) / results.length,
      totalGasCost: results.reduce((acc, r) => acc + r.gasCost, 0),
      netProfitLoss: results.reduce((acc, r) => acc + r.profitLoss, 0),
      worstSlippage: Math.max(...results.map(r => r.slippage)),
      bestExecution: Math.min(...successful.map(r => r.executionPrice))
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-blue-500" />
            Trade Simulation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Iterations</label>
                <Input
                  type="number"
                  value={iterations}
                  onChange={(e: { target: { value: string } }) => setIterations(parseInt(e.target.value))}
                  min={1}
                  max={100}
                  disabled={isSimulating}
                />
              </div>
              <Button
                className="mt-6"
                onClick={() => runSimulation({
                  route: ['Uniswap', 'Balancer'],
                  amount: 1000,
                  slippage: 0.5,
                  speed: 'balanced'
                })}
                disabled={isSimulating}
              >
                {isSimulating ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                {isSimulating ? 'Simulating...' : 'Run Simulation'}
              </Button>
            </div>

            {isSimulating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            {results.length > 0 && (
              <>
                <div className="pt-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={results}>
                      <XAxis dataKey="timestamp" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="executionPrice" 
                        stroke="#3b82f6" 
                        name="Execution"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="marketPrice" 
                        stroke="#ef4444" 
                        name="Market"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold">
                      {metrics.successRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Avg Slippage</p>
                    <p className="text-2xl font-bold">
                      {metrics.avgSlippage.toFixed(3)}%
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">Net P/L</p>
                    <p className={`text-2xl font-bold ${
                      metrics.netProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      ${metrics.netProfitLoss.toFixed(2)}
                    </p>
                  </div>
                </div>

                {metrics.worstSlippage > 1 && (
                  <Alert variant="warning">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      High slippage detected in some executions ({metrics.worstSlippage.toFixed(2)}%).
                      Consider adjusting the trade size or execution strategy.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}