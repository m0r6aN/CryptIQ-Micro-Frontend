// apps/cryptiq-shell/app/page.tsx

import { PortfolioDashboard } from '@/features/portfolio/components/PortfolioDashboard';
import { TradingInterface } from '@/features/trading/components/TradingInterface';
import { Suspense } from 'react'


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-4">
      <Suspense fallback={<div>Loading...</div>}>
        {/* <TradingInterface /> */}
        <PortfolioDashboard />
      </Suspense>
    </main>
  )
}
