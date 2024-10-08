// File: apps/cryptiq-shell/app/layout.tsx

import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from 'next-themes'
import { ThemeToggle } from '../shared/components/ThemeToggle'
import { Navbar } from '../shared/components/Navbar'
import { Footer } from '../shared/components/Footer'
const inter = Inter({ subsets: ['latin'] })
import '../styles/globals.css'

export const metadata = {
  title: 'CryptIQ - Portfolio Manager',
  description: 'Manage your crypto portfolio with real-time data and AI-powered insights.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-black dark:text-white`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <header className="flex items-center justify-between p-4">
              <Navbar />
              <ThemeToggle />
            </header>
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
