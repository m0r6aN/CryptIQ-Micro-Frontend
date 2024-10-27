import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Brain, TrendingUp, Activity, AlertTriangle, Power, Zap, Cpu } from 'lucide-react'
import { useState, useEffect } from 'react'

// Custom hook for WebSocket
const useTradeStream = () => {
  const [data, setData] = useState([])
  const [signals, setSignals] = useState([])
  const [performance, setPerformance] = useState([])

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:5000/trade-stream')
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      switch(message.type) {
        case 'TRADE_UPDATE':
          setData(prev => [...prev, message.data].slice(-100))
          break
        case 'SIGNAL':
          setSignals(prev => [...prev, message.data].slice(-20))
          break
        case 'PERFORMANCE':
          setPerformance(prev => [...prev, message.data].slice(-50))
          break
      }
    }

    return () => ws.close()
  }, [])

  return { data, signals, performance }
}

const AICommandCenter = () => {
  const { data, signals, performance } = useTradeStream()
  const [activeAgents, setActiveAgents] = useState([
    { 
      id: 1, 
      name: 'Sentiment Analyzer', 
      status: 'active', 
      confidence: 87,
      type: 'analysis',
      cpu: 45,
      memory: 1.2,
      lastSignal: '2m ago'
    },
    { 
      id: 2, 
      name: 'Risk Manager', 
      status: 'warning', 
      confidence: 64,
      type: 'risk',
      cpu: 32,
      memory: 0.8,
      lastSignal: '1m ago'
    },
    { 
      id: 3, 
      name: 'Portfolio Optimizer', 
      status: 'active', 
      confidence: 91,
      type: 'portfolio',
      cpu: 78,
      memory: 2.1,
      lastSignal: '30s ago'
    }
  ])

  const toggleAgent = (agentId) => {
    setActiveAgents(agents => 
      agents.map(agent => 
        agent.id === agentId 
          ? {...agent, status: agent.status === 'active' ? 'inactive' : 'active'}
          : agent
      )
    )
  }

  return (
    <div className="w-full space-y-4">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard 
          title="Active Agents" 
          value={activeAgents.filter(a => a.status === 'active').length} 
          icon={Brain}
        />
        <MetricCard 
          title="Open Positions" 
          value={data.length} 
          icon={TrendingUp}
        />
        <MetricCard 
          title="Active Signals" 
          value={signals.length} 
          icon={Activity}
          variant="warning"
        />
        <MetricCard 
          title="System Load" 
          value={`${activeAgents.reduce((acc, curr) => acc + curr.cpu, 0) / activeAgents.length}%`} 
          icon={Cpu}
          variant="danger"
        />
      </div>

      <Tabs defaultValue="agents" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="signals">Signals</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Agents Tab */}
        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4">
            {activeAgents.map(agent => (
              <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Brain className={`h-6 w-6 ${
                        agent.status === 'active' ? 'text-green-500' : 'text-yellow-500'
                      }`}/>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium leading-none">{agent.name}</p>
                          <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                            {agent.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Confidence: {agent.confidence}% | Last Signal: {agent.lastSignal}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">CPU: {agent.cpu}%</p>
                        <p className="text-sm text-muted-foreground">MEM: {agent.memory}GB</p>
                      </div>
                      <Button 
                        variant={agent.status === 'active' ? 'default' : 'secondary'}
                        size="sm"
                        onClick={() => toggleAgent(agent.id)}
                      >
                        <Power className="h-4 w-4 mr-2" />
                        {agent.status === 'active' ? 'Running' : 'Stopped'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Signals Tab */}
        <TabsContent value="signals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Signal Strength Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={signals}>
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="strength" 
                    stroke="#2563eb" 
                    fill="#3b82f6" 
                    fillOpacity={0.2} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performance}>
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10b981" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Resource Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={data}>
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="cpu" 
                      stroke="#ef4444" 
                      strokeWidth={2} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="memory" 
                      stroke="#8b5cf6" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Network Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={data}>
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="network" 
                      stroke="#06b6d4" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

const MetricCard = ({ title, value, icon: Icon, variant = 'default' }) => {
  const variants = {
    default: 'text-blue-500',
    warning: 'text-yellow-500',
    danger: 'text-red-500'
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${variants[variant]}`}/>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

export default AICommandCenter
