'use client'

import React, { useState, useTransition } from 'react'
import { Suspense } from 'react'

import CryptoData  from '../../../lib/types'

import CryptoTable from '../../../shared/components/CryptoTable'
import { Input } from '../../../shared/components/Input'
import { Button } from '../../../shared/components/Button'

// Loading Component
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
}

// Main Dashboard Page Component
export default function CryptoDashboardPage() {
  const [fromSymbols, setFromSymbols] = useState('BTC,SOL,ETH')
  const [toSymbols, setToSymbols] = useState('USDT')
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([])
  const [isPending, startTransition] = useTransition()

  const handleFetchData = async () => {
    startTransition(async () => {
      try {
        //const data = await fetchCryptoData(fromSymbols, toSymbols)
        //setCryptoData(data)
        return
      } catch (error) {
        console.error('Error fetching crypto data:', error)
        // Handle error (e.g., show error message to user)
      }
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Cryptocurrency Dashboard</h1>
      
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="From Symbols (e.g., BTC,SOL,ETH)"
          value={fromSymbols}
          onChange={(e) => setFromSymbols(e.target.value)}
          className="flex-grow"
        />
        <Input
          placeholder="To Symbol (e.g., USDT)"
          value={toSymbols}
          onChange={(e) => setToSymbols(e.target.value)}
          className="w-32"
        />
        <Button 
          onClick={handleFetchData}
          disabled={isPending}
        >
          {isPending ? 'Fetching...' : 'Fetch Data'}
        </Button>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        {cryptoData.length > 0 ? (
          <CryptoTable data={cryptoData} />
        ) : (
          <p>No data to display. Please fetch data.</p>
        )}
      </Suspense>
    </div>
  )
}