import { useState } from 'react'
import { 
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger 
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { TrailingStopForm } from './TrailingStopForm'
import { OCOOrderForm } from './OCOOrderForm'


type OrderTabValue = 'trailing' | 'oco'

interface AdvancedOrdersProps {
  symbol: string
  currentPrice: number
  onSubmitOrder: (order: any) => Promise<void>
}

export function AdvancedOrders({ 
    symbol, 
    currentPrice, 
    onSubmitOrder 
  }: AdvancedOrdersProps) {
    const [orderType, setOrderType] = useState<OrderTabValue>('trailing')
  
    // Add this handler to manage the type conversion
    const handleValueChange = (value: string) => {
      setOrderType(value as OrderTabValue)
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Advanced Orders</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Advanced Order Types</DialogTitle>
          </DialogHeader>
          <Tabs 
            value={orderType} 
            onValueChange={handleValueChange}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="trailing">Trailing Stop</TabsTrigger>
              <TabsTrigger value="oco">OCO Order</TabsTrigger>
            </TabsList>
            <TabsContent value="trailing">
              <TrailingStopForm 
                symbol={symbol}
                currentPrice={currentPrice}
                onSubmit={onSubmitOrder}
              />
            </TabsContent>
            <TabsContent value="oco">
              <OCOOrderForm 
                symbol={symbol}
                currentPrice={currentPrice}
                onSubmit={onSubmitOrder}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    )
  }