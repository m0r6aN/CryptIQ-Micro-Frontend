// components/trading/TradingTabs.tsx
"use client"

import { useState } from 'react'
import { OrderFormData } from '../types/trading'
import OrderForm, { OrderType } from './OrderForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/features/shared/ui/tabs'

export interface TradingTabsProps {
  defaultValue: OrderType
  onSubmit: (order: OrderFormData) => Promise<void>
}

export function TradingTabs({ defaultValue, onSubmit }: TradingTabsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (order: OrderFormData) => {
    setIsSubmitting(true)
    setError(null)
    try {
      await onSubmit(order)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit order')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        <TabsTrigger value="market">Market</TabsTrigger>
        <TabsTrigger value="limit">Limit</TabsTrigger>
        <TabsTrigger value="conditional">Conditional</TabsTrigger>
      </TabsList>
      <TabsContent value="market">
        <OrderForm 
          type="market"
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={error}
        />
      </TabsContent>
      <TabsContent value="limit">
        <OrderForm 
          type="limit"
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={error}
        />
      </TabsContent>
      <TabsContent value="conditional">
        <OrderForm 
          type="conditional"
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          error={error}
        />
      </TabsContent>
    </Tabs>
  )
}