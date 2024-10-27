import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Mic, Send, Bot, Gauge, TrendingUp, MessageSquare, Volume2 } from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
  confidence?: number
  sentiment?: 'positive' | 'negative' | 'neutral'
}

const TradingInterface = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [sentiment, setSentiment] = useState({
    overall: 'neutral',
    strength: 65,
    trends: ['BTC', 'ETH', 'SOL']
  })
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const recognition = useRef<any>(null)

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
      recognition.current.continuous = true
      recognition.current.interimResults = true
      
      recognition.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map(result => result.transcript)
          .join('')
        
        setInput(transcript)
      }
    }
  }, [])

  const toggleVoice = () => {
    if (isListening) {
      recognition.current?.stop()
    } else {
      recognition.current?.start()
    }
    setIsListening(!isListening)
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateTradeResponse(input),
        role: 'assistant',
        timestamp: new Date(),
        confidence: Math.random() * 30 + 70
      }
      setMessages(prev => [...prev, aiMessage])
    }, 1000)
  }

  const SentimentIndicator = () => (
    <div className="flex items-center gap-2">
      <Gauge className="h-5 w-5" />
      <div className="flex flex-col">
        <span className="text-sm font-medium">Market Sentiment</span>
        <div className="flex items-center gap-2">
          <Badge variant={sentiment.overall === 'positive' ? 'default' : 'secondary'}>
            {sentiment.strength}%
          </Badge>
          {sentiment.trends.map(trend => (
            <Badge key={trend} variant="outline">{trend}</Badge>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-[800px]">
      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>AI Trading Assistant</CardTitle>
          <SentimentIndicator />
        </CardHeader>
        <CardContent className="flex flex-col h-full pt-6">
          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`flex gap-2 max-w-[80%] ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800'
                    } rounded-lg p-4`}
                  >
                    {message.role === 'assistant' && (
                      <Bot className="h-5 w-5 flex-shrink-0" />
                    )}
                    <div>
                      <p>{message.content}</p>
                      {message.confidence && (
                        <div className="flex items-center gap-2 mt-2 text-sm opacity-80">
                          <TrendingUp className="h-4 w-4" />
                          <span>Confidence: {message.confidence.toFixed(1)}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex items-center gap-2 mt-4">
            <Button
              variant={isListening ? 'default' : 'outline'}
              size="icon"
              onClick={toggleVoice}
            >
              {isListening ? (
                <Volume2 className="h-4 w-4 animate-pulse text-green-500" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            <Input
              placeholder="Ask about trades or market analysis..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button onClick={handleSend}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function to generate AI responses
function generateTradeResponse(input: string): string {
  const responses = [
    "Based on current market sentiment and volume analysis, considering a long position in BTC with a 2% stop loss.",
    "Detecting increased correlation between ETH and SOL. Suggested pairs trading opportunity with 3:1 risk-reward.",
    "Market volatility is elevated. Recommend reducing position sizes to 50% normal allocation.",
    "Strong buy signals on multiple timeframes. Consider scaling in over the next 24 hours."
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

export default TradingInterface
