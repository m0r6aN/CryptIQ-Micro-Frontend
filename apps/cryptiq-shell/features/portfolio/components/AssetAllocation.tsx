
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart2,
  AlertCircle 
} from 'lucide-react'
import { AllocationSkeleton } from "./AllocationSkeleton"
import { Asset } from "../types/portfolio"
import { Card, CardContent, CardHeader, CardTitle } from '@/features/shared/ui/card'
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/features/shared/ui/tooltip'
import { Tooltip } from '@/features/shared/ui/tooltip'



// AssetAllocation Component
interface AssetAllocationProps {
    assets: Asset[]
    totalValue: number
    isLoading?: boolean
  }
  
  export function AssetAllocation({ assets, totalValue, isLoading }: AssetAllocationProps) {
    if (isLoading) {
      return <AllocationSkeleton />
    }
  
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Asset Allocation</CardTitle>
            <div className="text-sm text-muted-foreground">
              Total: ${totalValue.toLocaleString()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assets.map((asset) => (
              <AssetAllocationBar
                key={asset.id}
                asset={asset}
                totalValue={totalValue}
              />
            ))}
            {assets.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No assets in portfolio
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
  
  function AssetAllocationBar({ asset, totalValue }: { asset: Asset, totalValue: number }) {
    const percentage = (asset.value / totalValue) * 100
    const formattedValue = asset.value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{asset.name}</span>
                  <span className="text-muted-foreground">({asset.symbol})</span>
                </div>
                <span className="text-muted-foreground">{percentage.toFixed(2)}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>${formattedValue}</span>
                <span className={`flex items-center gap-1 ${
                  asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {asset.change24h >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(asset.change24h).toFixed(2)}%
                </span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              <div>Quantity: {asset.quantity}</div>
              <div>Price: ${asset.price.toFixed(2)}</div>
              <div>Value: ${formattedValue}</div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }