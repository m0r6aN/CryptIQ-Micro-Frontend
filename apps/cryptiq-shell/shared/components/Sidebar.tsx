// File: apps/web/components/dashboard/Sidebar.tsx
import Link from 'next/link'

export function Sidebar() {
  return (
    <aside className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-64 min-h-screen p-4">
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">Dashboard</Link>
          </li>
          <li>
            <Link href="/portfolio" className="block py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">Portfolio</Link>
          </li>
          <li>
            <Link href="/watchlist" className="block py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">Watchlist</Link>
          </li>
          <li>
            <Link href="/chat" className="block py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700">AI Chat</Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}