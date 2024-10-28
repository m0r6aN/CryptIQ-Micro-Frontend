export interface Agent {
    id: string
    name: string
    type: string
    generation: number
    fitness: number
    accuracy: number
    status: 'training' | 'evolved' | 'deployed' | 'warning'
    specialization: string[]
    cpuUsage: number         // Changed from cpu
    memoryUsage: number      // Changed from memory
    lastSignal: string
  }
 

export interface AgentData {
    confidence: number
    type: string
    generation: number
    fitness: number
    accuracy: number
    trainedEpochs: number
    status: 'training' | 'evolved' | 'deployed'
    specialization: string[]
    cpu: number
    memory: number
    lastSignal: string
  }
  
  interface AgentUpdateMessage {
    type: 'AGENT_UPDATE'
    agentId: string
    data: Partial<Agent>  // Using Agent interface instead of AgentData
  }
  
  interface TrainingProgressMessage {
    type: 'TRAINING_PROGRESS'
    progress: number
  }

  export type AgentStreamMessage = AgentUpdateMessage | TrainingProgressMessage