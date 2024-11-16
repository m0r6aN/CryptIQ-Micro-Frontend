import React, { useState } from 'react'

import { Brain, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { useWebSocket } from '@/hooks/use-web-socket'
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card'

interface SentimentData {
  overall: number  // -100 to 100
  socialScore: number
  newsScore: number
  technicalScore: number
  whaleActivity: {
    score: number
    recentMoves: string[]
  }
  alerts: string[]
}

export function MarketSentimentAnalyzer() {
    const [sentimentData, setSentimentData] = useState<SentimentData>({
      overall: 0,
      socialScore: 0,
      newsScore: 0,
      technicalScore: 0,
      whaleActivity: {
        score: 0,
        recentMoves: []
      },
      alerts: []
    })
    
  const getSentimentColor = (score: number) => {
    if (score > 30) return 'text-green-500'
    if (score < -30) return 'text-red-500'
    return 'text-yellow-500'
  }

  const SentimentIndicator = ({ score }: { score: number }) => (
    <div className={`flex items-center ${getSentimentColor(score)}`}>
      {score > 30 ? <TrendingUp className="w-4 h-4" /> : 
       score < -30 ? <TrendingDown className="w-4 h-4" /> :
       <AlertTriangle className="w-4 h-4" />}
      <span className="ml-2">{score}</span>
    </div>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Market Sentiment Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-sm text-gray-500">Overall</span>
            <div className="text-xl font-bold">
              <SentimentIndicator score={sentimentData?.overall || 0} />
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Social</span>
            <div className="text-xl font-bold">
              <SentimentIndicator score={sentimentData?.socialScore || 0} />
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-500">News</span>
            <div className="text-xl font-bold">
              <SentimentIndicator score={sentimentData?.newsScore || 0} />
            </div>
          </div>
          <div>
            <span className="text-sm text-gray-500">Technical</span>
            <div className="text-xl font-bold">
              <SentimentIndicator score={sentimentData?.technicalScore || 0} />
            </div>
          </div>
        </div>

        {sentimentData?.whaleActivity && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Whale Activity</h3>
            <ul className="space-y-2">
              {sentimentData.whaleActivity.recentMoves.map((move: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined, i: React.Key | null | undefined) => (
                <li key={i} className="text-sm">{move}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}