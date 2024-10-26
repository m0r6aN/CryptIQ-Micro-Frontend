import { useEffect, useState } from 'react'
import { CountdownProps } from '../../types/props'

export function Countdown({ expiryTime, onExpired }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>('')

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = expiryTime.getTime() - now

      if (distance < 0) {
        clearInterval(timer)
        onExpired?.()
        setTimeLeft('Expired')
        return
      }

      const hours = Math.floor(distance / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)
    }, 1000)

    return () => clearInterval(timer)
  }, [expiryTime, onExpired])

  return (
    <div className="text-xs font-mono text-muted-foreground">
      {timeLeft}
    </div>
  )
}