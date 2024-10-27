
// Multi-Agent Training Arena with Neural Evolution
import React, { useState, useEffect } from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Brain, Zap, Network, GitBranch, Cpu, Activity, Share2, Lock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card'
import { Badge } from '@/features/shared/ui/badge'
import { Button } from '@/features/shared/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/features/shared/ui/select'
import { Progress } from '@/features/shared/ui/progress'


interface Agent {
  id: string
  name: string
  type: string
  generation: number
  fitness: number
  accuracy: number
  trainedEpochs: number
  status: 'training' | 'evolved' | 'deployed'
  specialization: string[]
}

const AgentTrainingArena = () => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: '1',
      name: 'Alpha Hunter',
      type: 'DeepRL',
      generation: 3,
      fitness: 89.4,
      accuracy: 78.2,
      trainedEpochs: 1500,
      status: 'evolved',
      specialization: ['Market Making', 'Volatility Analysis']
    },
    {
      id: '2',
      name: 'Sentiment Oracle',
      type: 'Transformer',
      generation: 2,
      fitness: 92.1,
      accuracy: 81.5,
      trainedEpochs: 2000,
      status: 'training',
      specialization: ['Sentiment Analysis', 'News Impact']
    }
  ])

  const [selectedModel, setSelectedModel] = useState('deeprl')
  const [trainingProgress, setTrainingProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTrainingProgress(prev => (prev + 1) % 100)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const AgentCard = ({ agent }: { agent: Agent }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-blue-500" />
            <div>
              <h3 className="font-semibold">{agent.name}</h3>
              <p className="text-sm text-gray-500">{agent.type} Gen {agent.generation}</p>
            </div>
          </div>
          <Badge variant={agent.status === 'evolved' ? 'default' : 'secondary'}>
            {agent.status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500">Fitness</p>
            <p className="text-lg font-semibold">{agent.fitness}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Accuracy</p>
            <p className="text-lg font-semibold">{agent.accuracy}%</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {agent.specialization.map(spec => (
            <Badge key={spec} variant="outline">{spec}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Agent Training Network</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-6">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deeprl">Deep RL Model</SelectItem>
                  <SelectItem value="transformer">Transformer Model</SelectItem>
                  <SelectItem value="hybrid">Hybrid Model</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button>
                  <Zap className="mr-2 h-4 w-4" />
                  Train New Agent
                </Button>
                <Button variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share Knowledge
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span>Training Progress</span>
                </div>
                <span className="text-sm text-gray-500">Epoch {trainingProgress}/100</span>
              </div>
              <Progress value={trainingProgress} />
            </div>

            <ResponsiveContainer width="100%" height={300} className="mt-6">
              <LineChart data={generateTrainingData()}>
                <XAxis dataKey="epoch" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="fitness" stroke="#3b82f6" />
                <Line type="monotone" dataKey="accuracy" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" />
                <span>Active Agents</span>
              </div>
              <span className="font-semibold">8</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network className="h-5 w-5 text-green-500" />
                <span>Knowledge Transfers</span>
              </div>
              <span className="font-semibold">1.2M</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-purple-500" />
                <span>Model Generations</span>
              </div>
              <span className="font-semibold">5</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-red-500" />
                <span>Training Hours</span>
              </div>
              <span className="font-semibold">342</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map(agent => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  )
}

// Helper function to generate training data
function generateTrainingData() {
  return Array.from({ length: 100 }, (_, i) => ({
    epoch: i,
    fitness: 50 + Math.log(i + 1) * 10 + Math.random() * 5,
    accuracy: 40 + Math.log(i + 1) * 8 + Math.random() * 5
  }))
}

export default AgentTrainingArena