import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crypto Dashboard',
  description: 'Real-time cryptocurrency market data',
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}