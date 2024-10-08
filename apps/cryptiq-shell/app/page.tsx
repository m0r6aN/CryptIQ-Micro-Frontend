// File: apps/web/app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to CryptIQ</h1>
      <p className="text-xl mb-8">Your personal crypto portfolio management solution</p>
      <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
        Go to Dashboard
      </Link>
    </div>
  )
}
