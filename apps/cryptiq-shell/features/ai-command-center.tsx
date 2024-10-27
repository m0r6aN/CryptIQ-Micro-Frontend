import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Activity, Brain, TrendingUp, AlertTriangle } from 'lucide-react'

const AICommandCenter = () => {
  const [activeAgents, setActiveAgents] = React.useState([
    { id: 1, name: 'Sentiment Analyzer', status: 'active', confidence: 87 },
    { id: 2, name: 'Risk Manager', status: 'warning', confidence: 64 },
    { id: 3, name: 'Portfolio Optimizer', status: 'active', confidence: 91 }
  ])

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAgents.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Positions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Signals</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Medium</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="w-full">
        <TabsList>
          <TabsTrigger value="agents">Active Agents</TabsTrigger>
          <TabsTrigger value="signals">Signals</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        <TabsContent value="agents" className="space-y-4">
          <div className="grid gap-4">
            {activeAgents.map(agent => (
              <Card key={agent.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div className="flex items-center space-x-4">
                      <Brain className={`h-6 w-6 ${
                        agent.status === 'active' ? 'text-green-500' : 'text-yellow-500'
                      }`}/>
                      <div>
                        <p className="text-sm font-medium leading-none">{agent.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {agent.confidence}%
                        </p>
                      </div>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${
                      agent.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AICommandCenter
