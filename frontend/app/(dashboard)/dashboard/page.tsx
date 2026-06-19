'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, CalendarDays, Clock, TrendingUp, Archive, ArrowRight } from 'lucide-react'
import { eventsApi } from '@/lib/api/events.api'
import { useAuthStore } from '@/lib/store/auth.store'

interface Stats {
  eventCount: number
  archivedCount: number
  userCount: number
  pendingCount: number
  participationRate: number
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  sub?: React.ReactNode
  gradient?: boolean
}

function StatCard({ icon, label, value, sub, gradient }: StatCardProps) {
  return (
    <div
      className={`rounded-2xl p-6 ${gradient ? 'text-white' : 'border border-[#c1c6d7] bg-white text-[#1c1b1b]'}`}
      style={gradient ? { background: 'var(--brand-gradient)' } : {}}
    >
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${gradient ? 'bg-white/20' : 'bg-blue-50'}`}>
        <span className={gradient ? 'text-white' : 'text-[#005ab6]'}>{icon}</span>
      </div>
      <p className={`text-sm font-medium ${gradient ? 'text-white/80' : 'text-[#717786]'}`}>{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
      {sub && <div className="mt-2">{sub}</div>}
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const isManager = user?.role === 'owner' || user?.role === 'admin'

  useEffect(() => {
    if (!isManager) {
      setLoading(false)
      return
    }
    eventsApi.getStats()
      .then(setStats)
      .finally(() => setLoading(false))
  }, [isManager])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcf9f8] p-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl bg-gray-200" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <div className="px-8 py-10">

        {/* Titre */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1c1b1b]">
            Bonjour, {user?.first_name}&nbsp;👋
          </h1>
          <p className="mt-1 text-sm text-[#717786]">
            Voici un aperçu de votre organisation.
          </p>
        </div>

        {/* Stat cards */}
        {isManager && stats ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard
              gradient
              icon={<Users className="h-5 w-5" />}
              label="Membres"
              value={stats.userCount}
            />
            <StatCard
              icon={<CalendarDays className="h-5 w-5" />}
              label="Événements à venir"
              value={stats.eventCount}
            />
            <StatCard
              icon={<Clock className="h-5 w-5" />}
              label="En attente de validation"
              value={stats.pendingCount}
              sub={
                stats.pendingCount > 0 ? (
                  <Link
                    href="/dashboard/pending"
                    className="flex items-center gap-1 text-xs font-medium text-orange-600 hover:underline"
                  >
                    Voir les événements
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                ) : (
                  <span className="text-xs text-[#717786]">Aucun en attente</span>
                )
              }
            />
            <StatCard
              icon={<Archive className="h-5 w-5" />}
              label="Événements archivés"
              value={stats.archivedCount}
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              label="Taux de participation"
              value={`${stats.participationRate} %`}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Link href="/events/create" className="group rounded-2xl border border-[#c1c6d7] bg-white p-6 transition-shadow hover:shadow-md">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'var(--brand-gradient)' }}>
                <CalendarDays className="h-5 w-5 text-white" />
              </div>
              <p className="font-semibold text-[#1c1b1b] group-hover:text-[#005ab6]">Créer un événement</p>
              <p className="mt-1 text-sm text-[#717786]">Proposez un nouvel événement à votre organisation.</p>
            </Link>
            <Link href="/main" className="group rounded-2xl border border-[#c1c6d7] bg-white p-6 transition-shadow hover:shadow-md">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Users className="h-5 w-5 text-[#005ab6]" />
              </div>
              <p className="font-semibold text-[#1c1b1b] group-hover:text-[#005ab6]">Voir les événements</p>
              <p className="mt-1 text-sm text-[#717786]">Découvrez les événements publiés de votre organisation.</p>
            </Link>
          </div>
        )}

        {/* Accès rapide pending (admin/owner) */}
        {isManager && stats && stats.pendingCount > 0 && (
          <div className="mt-8 rounded-2xl border border-orange-200 bg-orange-50 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-orange-800">
                  {stats.pendingCount} événement{stats.pendingCount > 1 ? 's' : ''} en attente de validation
                </p>
                <p className="mt-0.5 text-sm text-orange-700">
                  Des membres ont soumis des événements qui nécessitent votre approbation.
                </p>
              </div>
              <Link
                href="/dashboard/pending"
                className="ml-4 shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-white"
                style={{ background: 'var(--brand-gradient)' }}
              >
                Gérer
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
