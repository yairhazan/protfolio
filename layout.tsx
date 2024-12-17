'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

const publicRoutes = ['/', '/login', '/register']

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if the user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    
    // If not authenticated and not on a public route, redirect to login
    if (!isAuthenticated && !publicRoutes.includes(pathname)) {
      router.push('/login')
    }
  }, [pathname, router])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Pro-tfolio - Your Financial Dashboard</title>
        <meta name="description" content="Manage all your financial resources in one place with Pro-tfolio" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

