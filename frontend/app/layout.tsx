import type { Metadata } from 'next'
import './globals.css'
import { Montserrat } from 'next/font/google'
import { cn } from '@/lib/utils'

const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'EvenTease',
  description: "Gestion d'événements multi-tenant",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={cn('font-sans', montserrat.variable)}>
      <body>{children}</body>
    </html>
  )
}
