// apps/cryptiq-shell/app/page.tsx

import { PortfolioDashboard } from "@/features/portfolio/components/PortfolioDashboard";
import { TradingInterface } from "@/features/trading/components/TradingInterface";

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <h1>CryptIQ Portfolio</h1>
      </header>
      <main style={{ display: 'flex', flex: 1, padding: '1rem', gap: '1rem' }}>
        <section style={{ flex: 2 }}>
          <PortfolioDashboard />
        </section>
      </main>
      <footer style={{ borderTop: '1px solid #ccc', padding: '1rem' }}>
        <TradingInterface />
      </footer>
    </div>
  );
}
