'use client'

import { useEffect, useState } from 'react'
import { eventsApi } from '@/lib/api/events.api'
import { useAuthStore } from '@/lib/store/auth.store'
import EventCard from '@/components/events/EventCard'
import type { Event, EventType } from '@/lib/types'

const FILTERS: { label: string; value: EventType | 'Tous' }[] = [
  { label: 'Tous', value: 'Tous' },
  { label: 'Conférence', value: 'Conférence' },
  { label: 'Team Building', value: 'Team Building' },
  { label: 'Apéritif', value: 'Apéritif' },
  { label: 'Autres', value: 'Autres' },
]

export default function MainPage() {
  const { user } = useAuthStore()
  const [events, setEvents]       = useState<Event[]>([])
  const [loading, setLoading]     = useState(true)
  const [activeFilter, setFilter] = useState<EventType | 'Tous'>('Tous')

  useEffect(() => {
    eventsApi.getAll()
      .then((data) => setEvents(data.filter((e) => e.status === 'published')))
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeFilter === 'Tous'
    ? events
    : events.filter((e) => e.type === activeFilter)

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <div className="mx-auto max-w-[1440px] px-10 py-10">

        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1c1b1b]">Événements à venir</h1>
          <p className="mt-1 text-sm text-[#717786]">
            Découvrez et participez aux événements de votre organisation.
          </p>
        </div>

        {/* Filtres */}
        <div className="mb-6 flex flex-wrap gap-2">
          {FILTERS.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === value
                  ? 'text-white'
                  : 'border border-[#c1c6d7] bg-white text-[#414754] hover:border-[#005ab6] hover:text-[#005ab6]'
              }`}
              style={activeFilter === value ? { background: 'var(--brand-gradient)' } : {}}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-full opacity-30"
              style={{ background: 'var(--brand-gradient)' }}
            >
              <span className="text-2xl text-white">🗓</span>
            </div>
            <p className="text-lg font-medium text-[#414754]">Aucun événement trouvé</p>
            <p className="mt-1 text-sm text-[#717786]">
              {activeFilter === 'Tous'
                ? 'Aucun événement publié pour le moment.'
                : `Aucun événement de type "${activeFilter}".`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                currentUser={user}
                onParticipationChange={(updated) =>
                  setEvents((prev) => prev.map((e) => (e._id === updated._id ? updated : e)))
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
