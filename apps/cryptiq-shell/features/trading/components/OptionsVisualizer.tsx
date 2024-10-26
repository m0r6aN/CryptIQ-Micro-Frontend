// components/OptionsVisualizer.tsx
import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart } from 'recharts' 
import { OptionsChainData, OptionsFlow } from '../types/options'
import cn from 'classNames'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface OptionsVisualizerProps {
  chainData: OptionsChainData
  recentFlows: OptionsFlow[]
  spotPrice: number
}

export function OptionsVisualizer({
  chainData,
  recentFlows,
  spotPrice
}: OptionsVisualizerProps) {
  const [selectedExpiry, setSelectedExpiry] = useState<Date>()
  const [highlightedStrike, setHighlightedStrike] = useState<number>()

  const volumeProfile = useMemo(() => {
    return chainData.calls.map(call => {
      const put = chainData.puts.find(p => p.strike === call.strike)
      return {
        strike: call.strike,
        callVolume: call.volume,
        putVolume: put?.volume || 0,
        callOI: call.openInterest,
        putOI: put?.openInterest || 0,
        callIV: call.impliedVolatility,
        putIV: put?.impliedVolatility || 0
      }
    })
  }, [chainData])

  return (
    <div className="space-y-4">
      {/* IV Skew Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Implied Volatility Skew</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volumeProfile}>
                <XAxis 
                  dataKey="strike" 
                  domain={['auto', 'auto']}
                />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone"
                  dataKey="callIV"
                  stroke="#22c55e"
                  dot={false}
                />
                <Line 
                  type="monotone"
                  dataKey="putIV"
                  stroke="#ef4444"
                  dot={false}
                />
                <ReferenceLine
                  x={spotPrice}
                  stroke="#666"
                  strokeDasharray="3 3"
                />
                <ReferenceLine
                  x={chainData.maxPain}
                  stroke="#eab308"
                  strokeDasharray="3 3"
                  label="Max Pain"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Options Chain */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Options Chain</CardTitle>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                P/C Ratio: {chainData.pcRatio.toFixed(2)}
              </div>
              <div className="text-sm">
                IV Skew: {chainData.ivSkew.toFixed(2)}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-px bg-muted">
            {/* Calls */}
            <div className="space-y-px">
              {chainData.calls.map(call => (
                <motion.div
                  key={`${call.strike}-${call.expiry.getTime()}`}
                  className={cn(
                    "grid grid-cols-6 gap-2 px-2 py-1",
                    call.strike < spotPrice ? "bg-green-50" : "bg-background"
                  )}
                  whileHover={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}
                >
                  <div>{call.bid}</div>
                  <div>{call.ask}</div>
                  <div>{call.volume}</div>
                  <div>{call.openInterest}</div>
                  <div>{(call.impliedVolatility * 100).toFixed(1)}%</div>
                  <div>{call.delta.toFixed(2)}</div>
                </motion.div>
              ))}
            </div>

            {/* Puts */}
            <div className="space-y-px">
              {chainData.puts.map(put => (
                <motion.div
                  key={`${put.strike}-${put.expiry.getTime()}`}
                  className={cn(
                    "grid grid-cols-6 gap-2 px-2 py-1",
                    put.strike > spotPrice ? "bg-red-50" : "bg-background"
                  )}
                  whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                >
                  <div>{put.bid}</div>
                  <div>{put.ask}</div>
                  <div>{put.volume}</div>
                  <div>{put.openInterest}</div>
                  <div>{(put.impliedVolatility * 100).toFixed(1)}%</div>
                  <div>{put.delta.toFixed(2)}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Options Flow */}
      <Card>
        <CardHeader>
          <CardTitle>Options Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentFlows.map(flow => (
              <motion.div
                key={`${flow.timestamp}-${flow.contract.strike}`}
                className={cn(
                  "flex items-center justify-between p-2 rounded",
                  flow.side === 'buy' ? 
                    flow.contract.type === 'call' ? 
                      "bg-green-100" : "bg-red-100" :
                    "bg-gray-100"
                )}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-4">
                  <Badge variant={
                    flow.contract.type === 'call' ? 'default' : 'destructive'
                  }>
                    {flow.contract.type.toUpperCase()}
                  </Badge>
                  <div className="font-mono">
                    ${flow.contract.strike}
                  </div>
                  <div>
                    {format(flow.contract.expiry, 'MMM dd')}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="font-mono">
                    ${flow.premium.toLocaleString()}
                  </div>
                  {flow.sweep && (
                    <Badge variant="warning">SWEEP</Badge>
                  )}
                  {flow.unusual && (
                    <Badge variant="secondary">UNUSUAL</Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}