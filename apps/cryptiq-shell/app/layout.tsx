import "./globals.css"
import { Metadata, Viewport } from "next"
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

interface RootLayoutProps {
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