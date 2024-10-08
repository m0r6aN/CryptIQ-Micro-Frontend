// File: apps/web/components/Navbar.tsx
import Link from 'next/link'
import dynamic from 'next/dynamic'

const ThemeToggle = dynamic(() => import('./ThemeToggle').then(mod => mod.ThemeToggle), {
  ssr: false
})

export function Navbar() {
  return (
    <nav className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl">CryptIQ</Link>
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="hover:text-gray-600 dark:hover:text-gray-300">Dashboard</Link>
            <Link href="/portfolio" className="hover:text-gray-600 dark:hover:text-gray-300">Portfolio</Link>
            <Link href="/watchlist" className="hover:text-gray-600 dark:hover:text-gray-300">Watchlist</Link>
            <Link href="/login" className="hover:text-gray-600 dark:hover:text-gray-300">Login</Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}