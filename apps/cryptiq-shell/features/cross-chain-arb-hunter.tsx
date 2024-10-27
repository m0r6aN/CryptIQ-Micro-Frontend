import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Zap, Wallet, Activity, Lock, Shield, Fuel, Network, ArrowRightLeft } from 'lucide-react'

interface ArbOpportunity {
  id: string
  path: string[]
  profit: number
  confidence: number
  gasOptimized: number
  mevProtection: boolean
  executionTime: number
  risk: 'low' | 'medium' | 'high'
  status: 'analyzing' | 'ready' | 'executing'
}

const CrossChainArbHunter = () => {
  const [opportunities, setOpportunities] = useState<ArbOpportunity[]>([])
  const [systemStatus, setSystemStatus] = useState({
    scanning: true,
    chainsMonitored: 12,
    totalProfit: 0,
    successRate: 94.5
  })

  // Simulate real-time opportunity discovery
  useEffect(() => {
    const interval = setInterval(() => {
      const newOpp: ArbOpportunity = {
        id: Date.now().toString(),
        path: ['ETH', 'MATIC', 'AVAX', 'ETH'],
        profit: Math.random() * 1000 + 100,
        confidence: Math.random() * 30 + 70,
        gasOptimized: Math.random() * 50 + 50,
        mevProtection: Math.random() > 0.3,
        executionTime: Math.random() * 10 + 5,
        risk: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        status: 'analyzing'
      }
      setOpportunities(prev => [newOpp, ...prev].slice(0, 5))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const OpportunityCard = ({ opp }: { opp: ArbOpportunity }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-2 flex-wrap flex-1">
            {opp.path.map((chain, i) => (
              <React.Fragment key={chain}>
                <Badge variant="outline">{chain}</Badge>
                {i < opp.path.length - 1 && <ArrowRightLeft className="h-4 w-4" />}
              </React.Fragment>
            ))}
          </div>
          <Badge variant={
            opp.status === 'ready' ? 'default' :
            opp.status === 'executing' ? 'destructive' : 'secondary'
          }>
            {opp.status}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Profit</p>
            <p className="text-lg font-bold text-green-500">
              ${opp.profit.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gas Saved</p>
            <p className="text-lg font-bold">
              {opp.gasOptimized.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Time</p>
            <p className="text-lg font-bold">
              {opp.executionTime.toFixed(1)}s
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {opp.mevProtection && (
              <Badge variant="secondary">
                <Shield className="h-3 w-3 mr-1" />
                MEV Protected
              </Badge>
            )}
            <Badge variant={
              opp.risk === 'low' ? 'default' :
              opp.risk === 'medium' ? 'secondary' : 'destructive'
            }>
              {opp.risk} risk
            </Badge>
          </div>
          <Button size="sm" variant={opp.status === 'ready' ? 'default' : 'secondary'}>
            <Zap className="h-4 w-4 mr-1" />
            Execute
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* System Status Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Network className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500">Chains Monitored</p>
                  <p className="text-2xl font-bold">{systemStatus.chainsMonitored}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-500">Total Profit</p>
                  <p className="text-2xl font-bold">${systemStatus.totalProfit.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-500">Success Rate</p>
                  <p className="text-2xl font-bold">{systemStatus.successRate}%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Fuel className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Gas Optimization</p>
                  <p className="text-2xl font-bold">Active</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Monitoring */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profit Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={generateProfitData()}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gas Optimization</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={generateGasData()}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="baseline" 
                  stroke="#94a3b8" 
                  strokeDasharray="5 5" 
                />
                <Line 
                  type="monotone" 
                  dataKey="optimized" 
                  stroke="#3b82f6" 
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Active Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle>Live Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {opportunities.map(opp => (
                <OpportunityCard key={opp.id} opp={opp} />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper functions for generating sample data
function generateProfitData() {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    profit: Math.random() * 1000 + 500
  }))
}

function generateGasData() {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    baseline: 100,
    optimized: Math.random() * 40 + 40
  }))
}

export default CrossChainArbHunter
