'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Bell, Settings, ChevronDown, User, LogOut, Plus, BookOpen } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/lib/store/auth.store'
import apiClient from '@/lib/api/client'

export default function NavBar() {
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const initials = user
    ? `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase()
    : ''

  const isManager = user?.role === 'owner' || user?.role === 'admin'

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout')
    } catch {
      // Déconnexion locale même si l'API échoue
    }
    logout()
    router.replace('/login')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#c1c6d7] bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-10">

        {/* Logo */}
        <Link href="/main" className="text-xl font-bold text-[#005ab6]">
          EvenTease
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {isManager ? (
            <>
              <Link
                href="/events/create"
                className="flex items-center gap-1.5 text-sm font-medium text-[#414754] transition-colors hover:text-[#005ab6]"
              >
                <Plus className="h-4 w-4" />
                Créer un event
              </Link>
              <Link
                href="/myevents"
                className="flex items-center gap-1.5 text-sm font-medium text-[#414754] transition-colors hover:text-[#005ab6]"
              >
                <BookOpen className="h-4 w-4" />
                Gérer mes events
              </Link>
            </>
          ) : (
            <Link
              href="/myevents"
              className="flex items-center gap-1.5 text-sm font-medium text-[#414754] transition-colors hover:text-[#005ab6]"
            >
              <BookOpen className="h-4 w-4" />
              Mes events
            </Link>
          )}
        </nav>

        {/* Icônes + Avatar */}
        <div className="flex items-center gap-1">
          <button type="button" className="rounded-lg p-2 text-[#717786] transition-colors hover:bg-gray-100">
            <Bell className="h-5 w-5" />
          </button>
          <button type="button" className="rounded-lg p-2 text-[#717786] transition-colors hover:bg-gray-100">
            <Settings className="h-5 w-5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger className="ml-1 flex items-center gap-1.5 rounded-lg p-1 outline-none transition-colors hover:bg-gray-100">
              {/* Avatar avec gradient brand */}
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: 'var(--brand-gradient)' }}
              >
                {initials}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-[#717786]" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-[#1c1b1b]">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs capitalize text-[#717786]">{user?.role}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push('/profile')}
                className="flex cursor-pointer items-center gap-2"
              >
                <User className="h-4 w-4" />
                Mon profil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex cursor-pointer items-center gap-2 text-[#ba1a1a] focus:bg-red-50 focus:text-[#ba1a1a]"
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
