'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutGrid,
  Home,
  Calendar,
  User,
  BookOpen,
  Users,
  Settings,
  LogOut,
  Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/store/auth.store'
import apiClient from '@/lib/api/client'
import { canManageMembers } from '@/lib/utils/permissions'
import type { UserRole } from '@/lib/types'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  adminOnly?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Accueil', icon: Home },
  { href: '/calendar', label: 'Calendrier', icon: Calendar },
  { href: '/profile', label: 'Mon Profil', icon: User },
  { href: '/myevents', label: 'Mes Events', icon: BookOpen },
  { href: '/members', label: 'Membres', icon: Users, adminOnly: true },
  { href: '/settings', label: 'Paramètres', icon: Settings, adminOnly: true },
]

export default function SideBar() {
  const [pendingCount, setPendingCount] = useState(0)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const role = (user?.role ?? 'member') as UserRole
  const isManager = canManageMembers(role)

  useEffect(() => {
    if (!isManager) return
    apiClient
      .get<{ pendingCount: number }>('/events/stats')
      .then(({ data }) => setPendingCount(data.pendingCount))
      .catch(() => undefined)
  }, [isManager])

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout')
    } catch {
      // Déconnexion locale même si l'API échoue
    }
    logout()
    router.replace('/login')
  }

  const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || isManager)

  return (
    <aside className="flex h-screen w-[280px] shrink-0 flex-col border-r border-[#c1c6d7] bg-white">

      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-[#c1c6d7] px-5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{ background: 'var(--brand-gradient)' }}
        >
          <LayoutGrid className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-base font-bold leading-tight text-[#005ab6]">EvenTease</p>
          <p className="text-[10px] font-medium uppercase tracking-widest text-[#717786]">
            Gestion d&apos;événements
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {visibleItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg py-2.5 pl-3 pr-3 text-sm font-medium transition-all',
                    'border-l-[3px]',
                    isActive
                      ? 'border-l-[#005ab6] bg-blue-50 font-semibold text-[#005ab6]'
                      : 'border-l-transparent text-[#414754] hover:bg-gray-50 hover:text-[#1c1b1b]',
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" />
                  <span className="flex-1">{label}</span>
                  {href === '/dashboard' && pendingCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ba1a1a] px-1 text-[10px] font-bold text-white">
                      {pendingCount > 9 ? '9+' : pendingCount}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* CTA + Déconnexion */}
      <div className="shrink-0 border-t border-[#c1c6d7] px-4 pb-5 pt-4">
        <Link
          href="/events/create"
          className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: 'var(--brand-gradient)' }}
        >
          <Plus className="h-4 w-4" />
          Créer un Event
        </Link>

        <div className="my-3 border-t border-[#c1c6d7]" />

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#ba1a1a] transition-colors hover:bg-red-50"
        >
          <LogOut className="h-[18px] w-[18px]" />
          Se déconnecter
        </button>
      </div>
    </aside>
  )
}
