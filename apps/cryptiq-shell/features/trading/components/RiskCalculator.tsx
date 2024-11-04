import { Position } from "features/shared/types/common"
import { Button } from "features/shared/ui/button"
import { Dialog, DialogHeader, DialogContent, DialogTrigger, DialogTitle } from "features/shared/ui/dialog"
import { Input } from "features/shared/ui/input"
import { Label } from "features/shared/ui/label"
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "features/shared/ui/select"
import { Slider } from "features/shared/ui/slider"
import { useState } from "react"

// Risk Calculator Modal
interface RiskCalculatorProps {
    position?: Position  // Optional - pre-fill with position data if provided
    accountBalance: number
    onApplyRisk?: (riskParams: RiskParameters) => void
  }
  
  type RiskParameters = {
    positionSize: number
    stopLoss: number
    riskAmount: number
    riskPercent: number
    leverage: number
    potentialProfit: number
    potentialLoss: number
  }
  
  export function RiskCalculator({ position, accountBalance, onApplyRisk }: RiskCalculatorProps) {
    const [params, setParams] = useState<RiskParameters>({
      positionSize: position?.size || 0,
      stopLoss: position?.stopLoss || 0,
      riskAmount: 0,
      riskPercent: 1,
      leverage: position?.leverage || 1,
      potentialProfit: 0,
      potentialLoss: 0
    })
  
    const calculateRisk = (updates: Partial<RiskParameters>) => {
      const newParams = { ...params, ...updates }
      const riskAmount = (newParams.positionSize * newParams.riskPercent) / 100
      const potentialLoss = riskAmount * newParams.leverage
      const potentialProfit = potentialLoss * 2 // Assuming 1:2 risk/reward
  
      setParams({
        ...newParams,
        riskAmount,
        potentialProfit,
        potentialLoss
      })
    }
  
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Risk Calculator</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Position Risk Calculator</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Position Size</Label>
                <Input
                  type="number"
                  value={params.positionSize}
                  onChange={(e) => calculateRisk({ positionSize: Number(e.target.value) })}
                />
              </div>
  
              <div className="space-y-2">
                <Label>Risk Percentage</Label>
                <Slider
                  value={[params.riskPercent]}
                  onValueChange={([value]) => calculateRisk({ riskPercent: value })}
                  min={0.1}
                  max={5}
                  step={0.1}
                />
                <div className="text-right text-sm">{params.riskPercent}%</div>
              </div>
  
              <div className="space-y-2">
                <Label>Leverage</Label>
                <Select
                  value={String(params.leverage)}
                  onValueChange={(value) => calculateRisk({ leverage: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select leverage" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 5, 10, 20, 50, 100].map((lev) => (
                      <SelectItem key={lev} value={String(lev)}>
                        {lev}x
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
  
            <div className="space-y-4 border-l pl-4">
              <div>
                <div className="text-sm text-muted-foreground">Risk Amount</div>
                <div className="text-lg font-medium">
                  ${params.riskAmount.toFixed(2)}
                </div>
              </div>
  
              <div>
                <div className="text-sm text-muted-foreground">Potential Loss</div>
                <div className="text-lg font-medium text-red-500">
                  ${params.potentialLoss.toFixed(2)}
                </div>
              </div>
  
              <div>
                <div className="text-sm text-muted-foreground">Potential Profit</div>
                <div className="text-lg font-medium text-green-500">
                  ${params.potentialProfit.toFixed(2)}
                </div>
              </div>
  
              <div>
                <div className="text-sm text-muted-foreground">Account Risk</div>
                <div className="text-lg font-medium">
                  {((params.potentialLoss / accountBalance) * 100).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
  
          {onApplyRisk && (
            <Button 
              className="w-full mt-4"
              onClick={() => onApplyRisk(params)}
            >
              Apply to Position
            </Button>
          )}
        </DialogContent>
      </Dialog>
    )
  }