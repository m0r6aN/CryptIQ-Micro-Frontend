import { useMemo } from 'react'
import { ArrowUpDown, RefreshCw, Droplets, Table } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from 'features/shared/ui/card'
import { Button } from 'features/shared/ui/button'
import { TableBody, TableCell } from 'features/shared/ui/Table'
import { TableRow } from 'features/shared/ui/Table'
import { TableHead } from 'features/shared/ui/Table'
import { TableHeader } from 'features/shared/ui/Table'
import { Progress } from 'features/shared/ui/progress'
import { Badge } from 'features/shared/ui/badge'

interface Pool {
  exchange: string
  pair: string
  liquidity: number
  volume24h: number
  price: number
  fee: number
  address: string
  utilization?: number
  tvl?: number
  apy?: number
}

interface PoolListProps {
  pools: Pool[]
  onSelect?: (pool: Pool) => void
  selectedPoolAddress?: string
  isLoading?: boolean
  onRefresh?: () => void
}

export function PoolList({ 
  pools, 
  onSelect, 
  selectedPoolAddress,
  isLoading,
  onRefresh 
}: PoolListProps) {
  const sortedPools = useMemo(() => {
    return [...pools].sort((a, b) => b.liquidity - a.liquidity)
  }, [pools])

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 80) return 'text-red-500'
    if (utilization > 60) return 'text-yellow-500'
    return 'text-green-500'
  }

  const getAPYColor = (apy: number) => {
    if (apy > 20) return 'text-green-500'
    if (apy > 10) return 'text-yellow-500'
    return 'text-gray-500'
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            Available Liquidity Pools
          </div>
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pool</TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm">
                    TVL
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" size="sm">
                    Volume 24h
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">APY</TableHead>
                <TableHead className="text-right">Utilization</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPools.map((pool) => (
                <TableRow 
                  key={pool.address}
                  className={`cursor-pointer hover:bg-muted/50 ${
                    selectedPoolAddress === pool.address ? 'bg-muted' : ''
                  }`}
                  onClick={() => onSelect?.(pool)}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{pool.pair}</span>
                      <span className="text-sm text-muted-foreground">
                        {pool.exchange}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    ${pool.tvl?.toLocaleString() || '0'}
                  </TableCell>
                  <TableCell className="text-right">
                    ${pool.volume24h.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={getAPYColor(pool.apy || 0)}>
                      {pool.apy?.toFixed(2)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-sm ${
                        getUtilizationColor(pool.utilization || 0)
                      }`}>
                        {pool.utilization?.toFixed(1)}%
                      </span>
                      <Progress 
                        value={pool.utilization} 
                        className="w-16"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {pools.length} Pools
            </Badge>
            <Badge variant="outline">
              ${pools.reduce((acc, p) => acc + p.tvl!, 0).toLocaleString()} TVL
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            Fee Range: {Math.min(...pools.map(p => p.fee))}% - 
            {Math.max(...pools.map(p => p.fee))}%
          </div>
        </div>
      </CardContent>
    </Card>
  )
}