import { useEffect } from "react"

import { PricePoint } from "@/features/shared/types/common"
import { useState } from "react"

export const useDEXPriceStream = (): PricePoint[] => {
    const [prices, setPrices] = useState<PricePoint[]>([])
    
    useEffect(() => {
      const ws = new WebSocket('ws://localhost:5000/dex-stream')
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        setPrices(prev => [...prev.slice(-100), {
          timestamp: Date.now(),
          price: data.uniswap, // base price
          dexPrices: {
            Uniswap: data.uniswap,
            Curve: data.curve,
            Balancer: data.balancer
          },
          volume: data.volume
        }])
      }
  
      return () => ws.close()
    }, [])
  
    return prices
  }