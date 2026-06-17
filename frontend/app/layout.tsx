import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EvenTease',
  description: 'Gestion d\'événements multi-tenant',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
