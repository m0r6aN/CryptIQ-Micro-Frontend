// components/MarketDepth.tsx
import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MarketDepthProps {
  bids: MarketDepthLevel[]
  asks: MarketDepthLevel[]
  lastPrice: number
  trades: OrderFlowData[]
}

export function MarketDepth({
  bids,
  asks,
  lastPrice,
  trades
}: MarketDepthProps) {
  const maxVolume = useMemo(() => {
    const allVolumes = [...bids, ...asks].map(level => level.volume)
    return Math.max(...allVolumes)
  }, [bids, asks])

  const recentTrades = useMemo(() => 
    trades
      .filter(t => t.timestamp > Date.now() - 60000) // Last minute
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5), // Top 5 trades
    [trades]
  )

  return (
    <div className="grid grid-cols-2 gap-1 h-[600px]">
      {/* Bids */}
      <div className="space-y-px">
        {bids.map(level => (
          <motion.div
            key={level.price}
            className="flex justify-between relative h-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <motion.div
              className="absolute inset-y-0 left-0 bg-green-500/20"
              style={{ width: `${(level.volume / maxVolume) * 100}%` }}
            />
            <div className="relative z-10 flex justify-between w-full px-2">
              <span className="font-mono">
                {level.price.toFixed(2)}
              </span>
              <span className="font-mono">
                {level.volume.toLocaleString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Asks */}
      <div className="space-y-px">
        {asks.map(level => (
          <motion.div
            key={level.price}
            className="flex justify-between relative h-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <motion.div
              className="absolute inset-y-0 right-0 bg-red-500/20"
              style={{ width: `${(level.volume / maxVolume) * 100}%` }}
            />
            <div className="relative z-10 flex justify-between w-full px-2">
              <span className="font-mono">
                {level.price.toFixed(2)}
              </span>
              <span className="font-mono">
                {level.volume.toLocaleString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Large Trades Overlay */}
      <AnimatePresence>
        {recentTrades.map(trade => (
          <motion.div
            key={`${trade.timestamp}-${trade.price}`}
            className={`absolute right-0 px-2 py-1 rounded ${
              trade.side === 'buy' 
                ? 'bg-green-500/90 text-white' 
                : 'bg-red-500/90 text-white'
            }`}
            initial={{ opacity: 0, y: 20, x: '100%' }}
            animate={{ opacity: 1, y: 0, x: '0%' }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <span className="font-mono">
                {trade.price.toFixed(2)}
              </span>
              <span className="font-bold">
                {trade.volume.toLocaleString()}
              </span>
              {trade.liquidation && (
                <span className="text-xs bg-yellow-400 text-black px-1 rounded">
                  LIQ
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}