import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PositionsSkeleton } from "@/features/portfolio/components/PositionsSkeleton"
import { BarChart2 } from "lucide-react"
import { Position } from "../types/common"
import { useState } from "react"

// ActivePositions Component
interface ActivePositionsProps {
  positions: Position[]
  onPositionClose: (positionId: string) => Promise<void>
  isLoading?: boolean
}

export function ActivePositions({ 
  positions, 
  onPositionClose,
  isLoading
}: ActivePositionsProps) {
  const [closingPositions, setClosingPositions] = useState<Set<string>>(new Set())

  const handleClose = async (positionId: string) => {
    setClosingPositions(prev => new Set([...prev, positionId]))
    try {
      await onPositionClose(positionId)
    } catch (error) {
      console.error('Failed to close position:', error)
    } finally {
      setClosingPositions(prev => {
        const next = new Set(prev)
        next.delete(positionId)
        return next
      })
    }
  }

  if (isLoading) {
    return <PositionsSkeleton />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Active Positions</CardTitle>
          <Badge variant="secondary">
            {positions.length} Position{positions.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {positions.map((position) => (
            <div 
              key={position.id} 
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{position.symbol}</span>
                  <Badge 
                    variant={position.side === 'long' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {position.side.toUpperCase()} {position.leverage}x
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Entry: ${position.entryPrice.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Current: ${position.currentPrice.toLocaleString()}
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className={`font-medium ${
                  position.pnl >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  ${position.pnl.toFixed(2)}
                  <br />
                  ({position.pnlPercent.toFixed(2)}%)
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={closingPositions.has(position.id)}
                  onClick={() => handleClose(position.id)}
                >
                  {closingPositions.has(position.id) ? 'Closing...' : 'Close'}
                </Button>
              </div>
            </div>
          ))}
          {positions.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <BarChart2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <div>No active positions</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}