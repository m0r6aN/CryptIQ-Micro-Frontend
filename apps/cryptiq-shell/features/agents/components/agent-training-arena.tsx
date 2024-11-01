import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card'
import { Button } from '@/features/shared/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/features/shared/ui/select'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Brain, TrendingUp, Activity, Cpu } from 'lucide-react'
import { useWebSocket } from '@/features/shared/hooks/useWebSocket'
import { Agent, AgentStreamMessage } from '../types/agents'


const AGENT_ENDPOINTS = {
  list: '/api/agents/list',
  train: '/api/agents/train',
  deploy: '/api/agents/deploy',
  metrics: '/api/agents/metrics'
} as const

export default function AgentTrainingArena() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedModel, setSelectedModel] = useState('deeprl')
  const [trainingProgress, setTrainingProgress] = useState(0)

  // Connect to both agent monitor and AI assistant services
  const { lastMessage: agentStream } = useWebSocket<AgentStreamMessage>({
    url: 'ws://agent-monitor-service:5000/agent-stream',
    onMessage: (data) => {
      console.log('Agent update received:', data)
    }
  })
  
  const { lastMessage: aiStream } = useWebSocket<AgentStreamMessage>({
    url: 'ws://ai-training-service:5000/training-stream',
    onMessage: (data) => {
      console.log('Training progress received:', data)
    }
  })

  // Fetch initial agent state
  useEffect(() => {
    async function fetchAgents() {
      const res = await fetch(AGENT_ENDPOINTS.list)
      const data = await res.json()
      setAgents(data)
    }
    fetchAgents()
  }, [])

  // Handle real-time agent updates
  useEffect(() => {
    if (!agentStream) return
    
    switch (agentStream.type) {
      case 'AGENT_UPDATE':
        setAgents(prev => 
          prev.map(agent => 
            agent.id === agentStream.agentId 
              ? { ...agent, ...agentStream.data }
              : agent
          )
        )
        break;
      // We can handle other message types here if needed
    }
  }, [agentStream])

  // Handle training progress updates
  useEffect(() => {
    if (aiStream?.type === 'TRAINING_PROGRESS') {
      setTrainingProgress(aiStream.progress)
    }
  }, [aiStream])

  const trainNewAgent = async () => {
    try {
      const res = await fetch(AGENT_ENDPOINTS.train, {
        method: 'POST',
        body: JSON.stringify({
          type: selectedModel,
          specialization: ['market_making', 'sentiment_analysis']
        })
      })
      const newAgent = await res.json()
      setAgents(prev => [...prev, newAgent])
    } catch (error) {
      console.error('Failed to train agent:', error)
    }
  }

  const deployAgent = async (agentId: string) => {
    try {
      await fetch(AGENT_ENDPOINTS.deploy, {
        method: 'POST',
        body: JSON.stringify({ agentId })
      })
      // Status update will come through websocket
    } catch (error) {
      console.error('Failed to deploy agent:', error)
    }
  }

  const AgentCard = ({ agent }: { agent: Agent }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className={`h-6 w-6 ${
              agent.status === 'evolved' ? 'text-green-500' : 
              agent.status === 'warning' ? 'text-yellow-500' : 'text-blue-500'
            }`} />
            <div>
              <h3 className="font-semibold">{agent.name}</h3>
              <p className="text-sm text-gray-500">{agent.type} Gen {agent.generation}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-500">Accuracy</p>
            <p className="text-lg font-semibold">{agent.accuracy}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">CPU Usage</p>
            <p className="text-lg font-semibold">{agent.cpuUsage}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map(agent => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
              <Brain className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Training Progress</p>
                <p className="text-2xl font-bold">{trainingProgress}%</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">System Load</p>
                <p className="text-2xl font-bold">
                  {Math.round(agents.reduce((acc, a) => acc + (a.cpuUsage || 0), 0) / agents.length)}%
                </p>
              </div>
              <Cpu className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Success Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round(agents.reduce((acc, a) => acc + a.accuracy, 0) / agents.length)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Agent Management</CardTitle>
            <div className="flex gap-4">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deeprl">Deep RL Agent</SelectItem>
                  <SelectItem value="transformer">Transformer Agent</SelectItem>
                  <SelectItem value="hybrid">Hybrid Agent</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={trainNewAgent}>Train New Agent</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Training Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={agents.map(a => ({ 
              generation: a.generation,
              fitness: a.fitness,
              accuracy: a.accuracy 
            }))}>
              <XAxis dataKey="generation" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="fitness" stroke="#3b82f6" />
              <Line type="monotone" dataKey="accuracy" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}