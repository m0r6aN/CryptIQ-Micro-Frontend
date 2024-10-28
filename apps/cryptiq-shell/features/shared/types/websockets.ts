// Add these interfaces at the top
interface RiskUpdateMessage {
    type: 'RISK_UPDATE'
    metrics: {
      correlationRisk: number
      volatilityRisk: number
      liquidityRisk: number
      marketRisk: number
      systemicRisk: number
    }
  }

  export interface RiskAlert {
    id: string
    severity: 'high' | 'medium' | 'low'
    message: string
  }
  
  interface RiskAlertMessage {
    type: 'ALERT'
    alert: RiskAlert
  }
  
  interface SentimentMessage {
    type: 'SENTIMENT'
    sentiment: number
  }
  
  export type RiskWebSocketMessage = RiskUpdateMessage | RiskAlertMessage
  export type SentimentWebSocketMessage = SentimentMessage