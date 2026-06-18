import Link from 'next/link'
import { Bell, Settings } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#c1c6d7] bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-10">

        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-[#005ab6]">
          EvenTease
        </Link>

        {/* Navigation centrale */}
        <nav className="flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-[#414754] transition-colors hover:text-[#005ab6]"
          >
            Accueil
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-[#414754] transition-colors hover:text-[#005ab6]"
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-[#005ab6] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Inscription
          </Link>
        </nav>

        {/* Icônes droite */}
        <div className="flex items-center gap-1 text-[#717786]">
          <button type="button" className="rounded-lg p-2 transition-colors hover:bg-gray-100">
            <Bell className="h-5 w-5" />
          </button>
          <button type="button" className="rounded-lg p-2 transition-colors hover:bg-gray-100">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
