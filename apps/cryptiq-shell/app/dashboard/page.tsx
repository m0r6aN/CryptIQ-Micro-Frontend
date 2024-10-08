'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import CryptoDashboardPage from '../../features/dashboard/components/CryptoDashboardPage'
import { Button } from '../../shared/components/Button'

// Loading Component
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
}

// Refresh Button Component
function RefreshButton() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  return (
    <Button 
      onClick={() => startTransition(() => router.refresh())} 
      disabled={isPending}
      className="mb-4"
    >
      {isPending ? 'Refreshing...' : 'Refresh Data'}
    </Button>
  )
}

// Main Dashboard Page Component
export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Cryptocurrency Dashboard</h1>
      <RefreshButton />
      <React.Suspense fallback={<LoadingSpinner />}>
        <CryptoDashboardPage />
      </React.Suspense>
    </div>
  )
}