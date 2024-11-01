import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/features/shared/ui/popover'
import { Button } from '@/features/shared/ui/button'
import { ScalpingOpportunity } from '../../types/screenerTypes'
import { calculateExpectedProfit, calculateNetProfit, estimateGasCost } from '../../utils/screenerUtils'

export function ExecutionPreview({ opportunity }: { opportunity: ScalpingOpportunity }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full">
          Execute Trade
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Trade Preview</h4>
            <p className="text-sm text-muted-foreground">
              Execute trade across {opportunity.dexLiquidity?.routes} DEXes
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-2 items-center gap-4">
              <span className="text-sm">Estimated Profit</span>
              <span className="text-sm font-mono">
                ${calculateExpectedProfit(opportunity)}
              </span>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <span className="text-sm">Max Slippage</span>
              <span className="text-sm font-mono">0.5%</span>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <span className="text-sm">Gas Estimate</span>
              <span className="text-sm font-mono">
                ${estimateGasCost(opportunity.dexLiquidity?.routes || 1)}
              </span>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <span className="text-sm">Net Profit</span>
              <span className="text-sm font-mono text-green-500">
                ${calculateNetProfit(opportunity)}
              </span>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}