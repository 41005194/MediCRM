import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MediCRM - Cabinet Kiné',
  description: 'CRM Paramédical Kinésithérapie',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body 
        className={inter.className} 
        suppressHydrationWarning   
      >
        <Providers>
          {children}
          <Toaster 
            richColors 
            position="top-center" 
            closeButton 
            duration={4000}
          />
        </Providers>
      </body>
    </html>
  )
}