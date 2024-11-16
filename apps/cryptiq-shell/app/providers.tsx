// File: apps/cryptiq-shell/app/providers.tsx
import { ThemeProvider } from "next-themes"
import { WagmiProvider } from 'wagmi'
import { 
  CreateConfigParameters,
  createStorage,
  createConfig,
  http,
  fallback
} from '@wagmi/core'

import { mainnet, arbitrum, optimism, polygon, base } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { injected } from '@wagmi/connectors'

const queryClient = new QueryClient()

const config = createConfig({
  chains: [mainnet, arbitrum, optimism, polygon, base],
  ssr: true, // server side rendering
  syncConnectedChain: true, // Keep the State['chainId'] in sync with the current connection.
  connectors: [injected()], 
  storage: createStorage({ storage: window.localStorage }), 
  batch: { multicall: true }, 
  cacheTime: 4_000, // Frequency in milliseconds for polling enabled features.
  pollingInterval: 4_000, // Frequency in milliseconds for polling enabled features.
  transports: {
    [mainnet.id]: fallback([
      http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`),
      http(`https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_KEY}`),
      http()
    ]),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
    [base.id]: http()
  }
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider 
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}