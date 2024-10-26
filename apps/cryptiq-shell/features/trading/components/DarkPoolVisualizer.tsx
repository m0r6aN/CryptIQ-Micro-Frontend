
// components/DarkPoolVisualizer.tsx

import React from 'react';
import { format } from 'date-fns';  // Fix for 'format' function to format dates
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { motion } from 'framer-motion';  // Importing motion for animations
import cn from 'classnames';  // Importing cn utility function for conditional classNames
import HeatMap from './HeatMap';  // Importing HeatMap component (assuming it’s located in the same directory)
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DarkPoolTrade, InstitutionalSignal } from '../types/institutional';

export function DarkPoolVisualizer({
  trades,
  signals,
  spotPrice
}: {
  trades: DarkPoolTrade[]
  signals: InstitutionalSignal[]
  spotPrice: number
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Dark Pool Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trades}>
                <Line
                  type="stepAfter"
                  dataKey="price"
                  stroke="#666"
                  dot={false}
                  strokeWidth={1}
                />
                <Bar dataKey="volume" fill="#8884d8" opacity={0.5}>
                  {trades.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.sentiment === 'accumulation' ? '#22c55e' :
                            entry.sentiment === 'distribution' ? '#ef4444' :
                            '#94a3b8'}
                    />
                  ))}
                </Bar>
                
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(tick) => format(new Date(tick), 'HH:mm')}
                />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />

                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const data = payload[0].payload as DarkPoolTrade;
                    return (
                      <div className={cn("bg-background border rounded-lg p-2 shadow-lg")}>
                        <div className="font-medium">
                          ${data.price.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Volume: ${data.volume.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Blocks: {data.blocks}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(data.timestamp), 'HH:mm:ss')}
                        </div>
                      </div>
                    );
                  }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <HeatMap 
        data={signals.map(signal => [signal.confidence, signal.volume])} 
        width={500}       
        height={300}      
        colorScale={(value) => value > 50 ? "#22c55e" : "#ef4444"} // Adjust color threshold as needed
      />

    </div>
  );
}
