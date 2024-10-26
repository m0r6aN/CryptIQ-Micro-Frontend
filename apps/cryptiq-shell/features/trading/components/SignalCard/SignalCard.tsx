// components/SignalCard.tsx
import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SignalCardProps } from '../../types/props'
import { Countdown } from './Countdown'
import { Sparkline } from './Sparkline'
import { calculateRiskReward } from '../../utils/calculations'


export const SignalCard = memo(({ 
  signal, 
  priceData, 
  isExpanded,
  onToggle,
  onTakeSignal 
}: SignalCardProps) => {
  const latestPrice = priceData[priceData.length - 1]?.price
  const priceChange = latestPrice 
    ? ((latestPrice - signal.price) / signal.price) * 100 
    : 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 border rounded-lg space-y-3 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{signal.symbol}</span>
            <Badge variant="outline">
              {signal.strength}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Countdown date={signal.expiryTime} />
            <span>{signal.timeframe}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              ${latestPrice?.toLocaleString() ?? signal.price.toLocaleString()}
            </span>
            <Badge variant={priceChange >= 0 ? 'default' : 'destructive'}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
            </Badge>
          </div>
          <div className="mt-1">
            <Sparkline 
              data={priceData} 
              color={priceChange >= 0 ? '#22c55e' : '#ef4444'}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="space-y-3"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Entry Zone</div>
                <div className="font-medium">
                  ${(signal.price * 0.99).toFixed(2)} - ${(signal.price * 1.01).toFixed(2)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Stop Loss</div>
                <div className="font-medium text-red-500">
                  ${signal.stopLoss?.toLocaleString() ?? 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Take Profit</div>
                <div className="font-medium text-green-500">
                  ${signal.takeProfit?.toLocaleString() ?? 'N/A'}
                </div>
              </div>
              <div>
              <div>
              <div className="text-sm text-gray-500">R:R Ratio</div>
              <div className="font-medium">
                {calculateRiskReward(signal.price, signal.stopLoss, signal.takeProfit)}
                {
                  (signal.takeProfit?.length ?? 0 > 1) && (
                    <span className="text-xs text-gray-500 ml-1">(avg)</span>
                )}
              </div>
             </div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Signal Strength</div>
              <div className="mt-1 h-2 bg-gray-100 rounded-full">
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${signal.confidence}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="flex-1"
        >
          {isExpanded ? 'Less' : 'More'} Info
        </Button>
        <Button
          size="sm"
          onClick={() => onTakeSignal(signal)}
          className="flex-1"
        >
          Take Signal
        </Button>
      </div>
    </motion.div>
  );
});