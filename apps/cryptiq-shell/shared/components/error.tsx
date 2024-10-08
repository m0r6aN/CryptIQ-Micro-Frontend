'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="p-4 bg-red-100 text-red-700 rounded-md">
      <h2 className="text-lg font-semibold">Error loading cryptocurrency data</h2>
      <p>{error.message}</p>
      <Button onClick={reset} className="mt-4">Try again</Button>
    </div>
  )
}