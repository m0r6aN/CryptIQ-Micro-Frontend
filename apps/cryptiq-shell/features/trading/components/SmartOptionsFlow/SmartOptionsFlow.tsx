// components/SmartOptionsFlow.tsx
import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Area,
  ComposedChart,
} from 'recharts'
import { Button } from '@/components/ui/button'
import { PatternAnalysis } from './PatternAnalysis'
import { SmartAlerts } from './SmartAlerts'

export function SmartOptionsFlow({
  signals,
  spotPrice,
  onSignalSelect,
}: {
  signals: SmartFlowSignal[]
  spotPrice: number
  onSignalSelect: (signal: SmartFlowSignal) => void
}) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '4h' | '1d'>('1h')
  const [activeTrade, setActiveTrade] = useState<SmartFlowSignal | null>(null)
  const [showAlerts, setShowAlerts] = useState(true)

  // Calculate real-time metrics
  const metrics = useMemo(() => {
    return {
      bullishFlow: signals.filter(s => 
        s.side === 'buy' && s.type === 'call' || 
        s.side === 'sell' && s.type === 'put'
      ).length,
      bearishFlow: signals.filter(s => 
        s.side === 'buy' && s.type === 'put' || 
        s.side === 'sell' && s.type === 'call'
      ).length,
      totalPremium: signals.reduce((sum, s) => sum + s.premium, 0),
      unusualActivity: signals.filter(s => s.optionsActivity.unusualActivity).length
    }
  }, [signals])

  // Analyze options flow patterns
  const patterns = useMemo(() => {
    return analyzeOptionsPatterns(signals, spotPrice)
  }, [signals, spotPrice])

  return (
    <div className="space-y-6">
      {/* Smart Money Dashboard */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Bullish Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.bullishFlow}
              <span className="text-sm text-muted-foreground ml-2">
                signals
              </span>
            </div>
            <div className="h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={signals.slice(-20)}>
                  <Line
                    type="monotone"
                    dataKey="sentiment.score"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Bearish Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.bearishFlow}
              <span className="text-sm text-muted-foreground ml-2">
                signals
              </span>
            </div>
            <div className="h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={signals.slice(-20)}>
                  <Line
                    type="monotone"
                    dataKey="sentiment.score"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Premium Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.totalPremium.toLocaleString()}
              <span className="text-sm text-muted-foreground ml-2">
                total
              </span>
            </div>
            <div className="h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={signals.slice(-20)}>
                  <Bar
                    dataKey="premium"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Unusual Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.unusualActivity}
              <span className="text-sm text-muted-foreground ml-2">
                alerts
              </span>
            </div>
            <div className="h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={signals.slice(-20)}>
                  <Bar
                    dataKey="optionsActivity.volumeOIRatio"
                    fill="#9333ea"
                    radius={[4, 4, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="optionsActivity.putCallRatio"
                    stroke="#eab308"
                    strokeWidth={2}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Options Flow Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Smart Money Flow</CardTitle>
          <CardDescription>
            Real-time analysis of institutional options activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="flow" className="space-y-4">
            <TabsList>
              <TabsTrigger value="flow">Flow Analysis</TabsTrigger>
              <TabsTrigger value="patterns">Pattern Detection</TabsTrigger>
              <TabsTrigger value="alerts">Smart Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="flow" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Options Flow Chart */}
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={signals}>
                      <XAxis 
                        dataKey="strike" 
                        scale="band" 
                      />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="premium"
                        fill="#8884d8"
                        name="Premium"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="sentiment.score"
                        stroke="#82ca9d"
                        name="Sentiment"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

                {/* Strike Price Heat Map */}
                <div className="h-[400px]">
                  <StrikePriceHeatMap 
                    signals={signals}
                    spotPrice={spotPrice}
                  />
                </div>
              </div>

              {/* Active Signals */}
              <div className="space-y-2">
                {signals.map((signal, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={cn(
                      "p-4 rounded-lg border",
                      signal.sentiment.score > 0.6 ? "border-green-200 bg-green-50" :
                      signal.sentiment.score < 0.4 ? "border-red-200 bg-red-50" :
                      "border-yellow-200 bg-yellow-50"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge>
                            {signal.type.toUpperCase()} {signal.strike}
                          </Badge>
                          <Badge variant="outline">
                            {format(signal.expiry, 'MMM dd')}
                          </Badge>
                          {signal.optionsActivity.unusualActivity && (
                            <Badge variant="destructive">
                              UNUSUAL
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Premium: ${signal.premium.toLocaleString()}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-medium">
                          Sentiment: {(signal.sentiment.score * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Confidence: {(signal.sentiment.confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    {activeTrade === signal && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="mt-4 space-y-2"
                      >
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">
                              IV Percentile
                            </div>
                            <div className="font-medium">
                              {(signal.ivPercentile * 100).toFixed(1)}%
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Volume/OI
                            </div>
                            <div className="font-medium">
                              {signal.optionsActivity.volumeOIRatio.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">
                              Block Trades
                            </div>
                            <div className="font-medium">
                              {signal.optionsActivity.blockTrades}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-muted-foreground mb-1">
                            Price Action
                          </div>
                          <div className="h-[100px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={signal.priceAction.volumeProfile}>
                                <Line
                                  type="monotone"
                                  dataKey="value"
                                  stroke="#8884d8"
                                  strokeWidth={2}
                                  dot={false}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="mt-4 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTrade(
                          activeTrade === signal ? null : signal
                        )}
                      >
                        {activeTrade === signal ? 'Less' : 'More'} Info
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => onSignalSelect(signal)}
                      >
                        Analyze Trade
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="patterns">
              <PatternAnalysis patterns={patterns} />
            </TabsContent>

            <TabsContent value="alerts">
              <SmartAlerts signals={signals} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}