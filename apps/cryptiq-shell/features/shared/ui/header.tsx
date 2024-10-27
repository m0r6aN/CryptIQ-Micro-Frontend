import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { DarkThemeToggle} from 'flowbite-react'
import { TopNavbar } from './TopNavbar'

async function UserOrLogin() {
  return (
    <>
      <Link href="https://wow.groq.com/groq-labs/" rel="nofollow">
        {/* <IconGroq className="size-6 mr-2 dark:hidden" />
          <IconGroq className="hidden size-6 mr-2 dark:block" /> */}
        <Image
          src="/groqlabs-logo-black.png"
          alt="GroqLabs Logo"
          width={100}
          height={30}
        />
      </Link>

     <TopNavbar />
    </>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>
      <DarkThemeToggle />
    </header>
  )
}
