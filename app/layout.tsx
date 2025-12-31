import type { Metadata } from 'next'
import Providers from './providers'
import { Inter } from 'next/font/google'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { theme } from '../lib/theme'
import '../styles/globals.css'
import TopMenuBar from '../components/layout/TopMenuBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TravellerClicks - Bike Rentals, Car Rentals & Travel Services',
  description: 'Find and book bikes, cars, campervans, hotels, and travel experiences across India. Your one-stop destination for all travel needs.',
  keywords: 'bike rental, car rental, campervan rental, hotels, travel, India',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
           <Providers>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <TopMenuBar />
            <main className="min-h-screen bg-gray-50">
              {children}
            </main>
          </ThemeProvider>
        </AppRouterCacheProvider>
        </Providers>
      </body>
    </html>
  )
}