import "./globals.css"
import { Metadata, Viewport } from "next"
import { fontSans } from "@/lib/fonts"
import cn from 'classNames'
import { SidebarProvider, SidebarTrigger } from "@/features/shared/ui/sidebar"

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export interface RootLayoutProps {
  children: React.ReactNode
}

export default function Layout({
    children 
  }: { 
    children: React.ReactNode 
  }) {
  return (
    <html lang="en" suppressHydrationWarning>
    <head />
    <body
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontSans.variable
      )}
    >
        <SidebarProvider>
            <SidebarTrigger />
            {children}          
        </SidebarProvider>
      </body>
    </html>
  )
}