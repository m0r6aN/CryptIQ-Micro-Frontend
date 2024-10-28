import { useEffect, useState } from "react"

// Custom hook for WebSocket
export const useTradeStream = () => {
    const [data, setData] = useState<any[]>([])
    const [signals, setSignals] = useState<any[]>([])
    const [performance, setPerformance] = useState<any[]>([])
  
    useEffect(() => {
      const ws = new WebSocket('ws://localhost:5000/trade-stream')
      
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data)
        switch(message.type) {
          case 'TRADE_UPDATE':
            setData(prev => [...prev, message.data].slice(-100))
            break
          case 'SIGNAL':
            setSignals(prev => [...prev, message.data].slice(-20))
            break
          case 'PERFORMANCE':
            setPerformance(prev => [...prev, message.data].slice(-50))
            break
        }
      }
  
      return () => ws.close()
    }, [])
  
    return { data, signals, performance }
  }
  