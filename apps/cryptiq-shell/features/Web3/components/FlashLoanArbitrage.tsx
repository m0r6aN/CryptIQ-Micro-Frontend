import { useWebSocket } from 'features/shared/hooks/useWebSocket'
import { Badge } from 'features/shared/ui/badge'
import { Button } from 'features/shared/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from 'features/shared/ui/card'
import { Progress } from 'features/shared/ui/progress'
import { Activity, Timer, Zap } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'


// Add any missing interfaces
export interface SimulationState {
  isSimulating: boolean
  progress: number
  expectedProfit: number
  risk: number
}

export interface ArbitrageOpportunity {
  id: string
  route: string[]
  profitUSD: number
  requiredAmount: number
  expectedSlippage: number
  confidence: number
  estimatedGas: number
  pools: Array<{
    name: string
    liquidity: number
    utilization: number
  }>
  expiresAt: number
}

export interface LiquidityUpdate {
  poolLiquidity: {
    [poolName: string]: number
  }
  timestamp: number
}

const ENDPOINTS = {
  opportunities: '/api/flash-loan/opportunities',
  simulate: '/api/flash-loan/simulate',
  execute: '/api/flash-loan/execute',
  pools: '/api/liquidity/pools',
} as const

export default function FlashLoanArbitrage() {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([])
  const [selectedOpp, setSelectedOpp] = useState<ArbitrageOpportunity | null>(null)
  const [simulation, setSimulation] = useState<SimulationState>({
    isSimulating: false,
    progress: 0,
    expectedProfit: 0,
    risk: 0
  })

  // Combine WebSocket handlers - remove duplicate effects
  const { lastMessage: liquidityStream } = useWebSocket({ 
    url: 'ws://crypto-data-service:5000/liquidity-stream',
    onMessage: (message: LiquidityUpdate) => {
      if (selectedOpp && message.poolLiquidity) {
        const updatedPools = selectedOpp.pools.map(pool => ({
          ...pool,
          liquidity: message.poolLiquidity[pool.name] || pool.liquidity
        }))
        setSelectedOpp(prev => prev ? { ...prev, pools: updatedPools } : null)
      }
    },
    onError: (error) => {
      console.error('Liquidity stream error:', error)
    }
  })

  const { lastMessage: arbitrageStream } = useWebSocket({ 
    url: 'ws://trading-service:5000/arbitrage-stream',
    onMessage: (message: any) => {
      if (message.type === 'NEW_OPPORTUNITY') {
        setOpportunities(prev => [...prev, message.opportunity]
          .sort((a, b) => b.profitUSD - a.profitUSD)
          .slice(0, 10))
      } else if (message.type === 'EXPIRED_OPPORTUNITY') {
        setOpportunities(prev => 
          prev.filter(o => o.id !== message.opportunityId)
        )
      }
    },
    onError: (error) => {
      console.error('Arbitrage stream error:', error)
    }
  })

  const simulateArbitrage = async (opp: ArbitrageOpportunity) => {
    setSimulation({ ...simulation, isSimulating: true })
    try {
      const res = await fetch(ENDPOINTS.simulate, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          route: opp.route,
          amount: opp.requiredAmount
        })
      })
      const data = await res.json()
      setSimulation({
        isSimulating: false,
        progress: 100,
        expectedProfit: data.expectedProfit,
        risk: data.risk
      })
    } catch (error) {
      setSimulation({ ...simulation, isSimulating: false })
      console.error('Simulation failed:', error)
    }
  }

  const executeArbitrage = async (opp: ArbitrageOpportunity) => {
    try {
      const res = await fetch(ENDPOINTS.execute, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: opp.route,
          amount: opp.requiredAmount,
          maxSlippage: opp.expectedSlippage * 1.1 // Add 10% buffer
        })
      })
      const result = await res.json()
      if (!result.success) {
        throw new Error(result.error)
      }
      // Trade execution status will come through websocket
    } catch (error) {
      console.error('Execution failed:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Live Opportunities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {opportunities.map(opp => (
              <div 
                key={opp.id} 
                className="p-4 rounded-lg border hover:border-blue-500 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedOpp(opp)
                  simulateArbitrage(opp)
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Badge className="mb-2" variant="default">
                      ${opp.profitUSD.toFixed(2)} Profit
                    </Badge>
                    <div className="flex gap-2 items-center text-sm">
                      <Timer className="h-4 w-4" />
                      <span>
                        {Math.max(0, Math.floor((opp.expiresAt - Date.now()) / 1000))}s
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline">{opp.confidence}% Confidence</Badge>
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  {opp.route.map((step, i) => (
                    <React.Fragment key={i}>
                      <span className="text-sm font-mono">{step}</span>
                      {i < opp.route.length - 1 && (
                        <Zap className="h-4 w-4 text-blue-500" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {selectedOpp && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Execution Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <p className="text-sm text-gray-500">Required Amount</p>
                    <p className="text-2xl font-bold">
                      ${selectedOpp.requiredAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <p className="text-sm text-gray-500">Expected Profit</p>
                    <p className="text-2xl font-bold text-green-500">
                      ${selectedOpp.profitUSD.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <p className="text-sm text-gray-500">Gas Cost</p>
                    <p className="text-2xl font-bold">
                      ${selectedOpp.estimatedGas.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="font-medium">Liquidity Pool Status</p>
                  {selectedOpp.pools.map(pool => (
                    <div key={pool.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">{pool.name}</span>
                        <span className="text-sm">{pool.utilization}% Utilized</span>
                      </div>
                      <Progress value={pool.utilization} />
                    </div>
                  ))}
                </div>

                <Card>
                  <CardContent className="pt-6">
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={selectedOpp.pools.map(p => ({
                        name: p.name,
                        liquidity: p.liquidity
                      }))}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="liquidity" 
                          stroke="#3b82f6" 
                          fill="#3b82f6" 
                          fillOpacity={0.2} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="flex justify-between gap-4">
                  <Button 
                    className="flex-1" 
                    variant="outline"
                    onClick={() => simulateArbitrage(selectedOpp)}
                  >
                    <Activity className="mr-2 h-4 w-4" />
                    Simulate Again
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => executeArbitrage(selectedOpp)}
                    disabled={simulation.isSimulating}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Execute Trade
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}