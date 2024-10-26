// components/GreeksSurfaceVisualizer.tsx
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Plot from 'react-plotly.js'
import cn from 'classNames'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { GreeksData } from '../types/greeks'
import { generateHedgingSuggestions } from '../utils/riskManagement'
import { HedgeParams } from '../types/hedge'

export function GreeksSurfaceVisualizer({
  data,
  spotPrice,
  onHedgeRequest
}: {
  data: GreeksData[]
  spotPrice: number
  onHedgeRequest: (params: HedgeParams) => Promise<void>
}) {
  const [selectedGreek, setSelectedGreek] = useState<keyof GreeksData>('gamma')
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d')
  const [showProjections, setShowProjections] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)

  // Create 3D surface data
  const surfaceData = useMemo(() => {
    const strikes = [...new Set(data.map(d => d.strike))].sort((a, b) => a - b)
    const expiries = [...new Set(data.map(d => d.expiry))].sort((a, b) => a - b)
    
    const zValues = expiries.map(exp => 
      strikes.map(strike => {
        const point = data.find(d => 
          d.strike === strike && d.expiry === exp
        )
        return point ? point[selectedGreek] : 0
      })
    )

    return [{
      type: 'surface',
      x: strikes,
      y: expiries,
      z: zValues,
      colorscale: 'Viridis',
      contours: {
        z: {
          show: true,
          usecolormap: true,
          highlightcolor: "#42f462",
          project: { z: showProjections }
        }
      }
    }]
  }, [data, selectedGreek, showProjections])

  // Animation frame
  useEffect(() => {
    let frame: number
    
    const animate = () => {
      if (containerRef.current) {
        const layout = {
          ...Plot.layout,
          scene: {
            camera: {
              eye: {
                x: Math.cos(Date.now() * 0.001 * animationSpeed) * 2,
                y: Math.sin(Date.now() * 0.001 * animationSpeed) * 2,
                z: 1.5
              }
            }
          }
        }
        
        Plot.relayout(containerRef.current, layout)
      }
      frame = requestAnimationFrame(animate)
    }

    if (viewMode === '3d') {
      animate()
    }

    return () => cancelAnimationFrame(frame)
  }, [viewMode, animationSpeed])

  // Calculate risk metrics
  const riskMetrics = useMemo(() => {
    return calculatePositionRisk(data, spotPrice)
  }, [data, spotPrice])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-x-4">
          <Select
            value={selectedGreek}
            onValueChange={(value: keyof GreeksData) => 
              setSelectedGreek(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Greek" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="delta">Delta</SelectItem>
              <SelectItem value="gamma">Gamma</SelectItem>
              <SelectItem value="theta">Theta</SelectItem>
              <SelectItem value="vega">Vega</SelectItem>
              <SelectItem value="charm">Charm</SelectItem>
              <SelectItem value="vanna">Vanna</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant={viewMode === '3d' ? 'default' : 'outline'}
            onClick={() => setViewMode('3d')}
          >
            3D View
          </Button>
          <Button
            variant={viewMode === '2d' ? 'default' : 'outline'}
            onClick={() => setViewMode('2d')}
          >
            2D View
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="space-y-2">
            <span className="text-sm text-muted-foreground">
              Animation Speed
            </span>
            <Slider
              value={[animationSpeed]}
              onValueChange={([value]) => setAnimationSpeed(value)}
              min={0}
              max={2}
              step={0.1}
              className="w-32"
            />
          </div>

          <Button
            variant="outline"
            onClick={() => setShowProjections(!showProjections)}
          >
            {showProjections ? 'Hide' : 'Show'} Projections
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <div className="p-4">
            <h3 className="font-semibold mb-2">Position Delta</h3>
            <div className="text-2xl font-bold">
              ${riskMetrics.deltaDollar.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Gamma Scalp: ${riskMetrics.gammaScalp.toLocaleString()}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="font-semibold mb-2">Theta Decay</h3>
            <div className="text-2xl font-bold text-red-500">
              -${Math.abs(riskMetrics.thetaDecay).toLocaleString()}/day
            </div>
            <div className="text-sm text-muted-foreground">
              Vega Exposure: ${riskMetrics.vegaExposure.toLocaleString()}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="font-semibold mb-2">Hedge Ratio</h3>
            <div className="text-2xl font-bold">
              {(riskMetrics.optimalHedgeRatio * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">
              Efficiency: {(riskMetrics.hedgeEfficiency * 100).toFixed(1)}%
            </div>
          </div>
        </Card>
      </div>

      <div ref={containerRef} className="h-[600px] w-full">
        {viewMode === '3d' ? (
          <Plot.Plot
            data={surfaceData}
            layout={{
              margin: { l: 0, r: 0, b: 0, t: 0 },
              scene: {
                xaxis: { title: 'Strike Price' },
                yaxis: { title: 'Days to Expiry' },
                zaxis: { title: selectedGreek.toUpperCase() },
                camera: {
                  eye: { x: 1.5, y: 1.5, z: 1.5 }
                }
              }
            }}
            config={{ responsive: true }}
          />
        ) : (
          <HeatMap
            data={transformTo2D(data, selectedGreek)}
            xScale={{ type: 'linear' }}
            yScale={{ type: 'linear' }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Strike Price',
              legendPosition: 'middle',
              legendOffset: 36
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Days to Expiry',
              legendPosition: 'middle',
              legendOffset: -40
            }}
            colors={{
              type: 'diverging',
              scheme: 'spectral',
              divergeAt: 0.5
            }}
            cellOpacity={0.85}
            cellHoverOpacity={1}
            cellShape="circle"
            enableLabels={false}
            animate={true}
            motionConfig="gentle"
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="p-4">
            <h3 className="font-semibold mb-4">Risk Analysis</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">
                  Spot Gamma Level
                </div>
                <div className="relative pt-2">
                  <div 
                    className="h-2 bg-gradient-to-r from-green-500 to-red-500 rounded-full"
                  />
                  <div 
                    className="absolute top-0 w-2 h-4 bg-white border rounded"
                    style={{ 
                      left: `${riskMetrics.spotGammaLevel * 100}%`,
                      transform: 'translateX(-50%)'
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground">
                  Rebalance Urgency
                </div>
                <div className="flex gap-2 mt-1">
                  {['low', 'medium', 'high'].map(level => (
                    <div
                      key={level}
                      className={cn(
                        "flex-1 h-2 rounded-full",
                        riskMetrics.rebalanceUrgency === level
                          ? level === 'low' 
                            ? 'bg-green-500'
                            : level === 'medium'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                          : 'bg-gray-200'
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4">
            <h3 className="font-semibold mb-4">Suggested Actions</h3>
            <div className="space-y-2">
              {generateHedgingSuggestions(riskMetrics).map((suggestion, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between p-2 rounded bg-muted"
                >
                  <span>{suggestion.action}</span>
                  <Button
                    size="sm"
                    onClick={() => onHedgeRequest(suggestion.params)}
                  >
                    Execute
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}