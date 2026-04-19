import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Prodea | Structure Your Ideas',
  description: 'AI-guided system that helps users refine raw ideas into structured, build-ready project blueprints.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

import { MoltenBackground } from '@/components/MoltenBackground'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased relative`}>
        <MoltenBackground />
        {children}
      </body>
    </html>
  )
}
