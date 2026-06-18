'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, MapPin, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { eventsApi } from '@/lib/api/events.api'
import { useAuthStore } from '@/lib/store/auth.store'
import type { Event, EventType } from '@/lib/types'

/* ── Config types ─────────────────────────────────────────────────────── */
const TYPE_CONFIG: Record<EventType, { label: string; className: string }> = {
  'Conférence':    { label: 'Conférence',    className: 'bg-purple-100 text-purple-700' },
  'Team Building': { label: 'Team Building', className: 'bg-emerald-100 text-emerald-700' },
  'Apéritif':      { label: 'Apéritif',      className: 'bg-orange-100 text-orange-700' },
  'Autres':        { label: 'Autres',         className: 'bg-blue-100 text-blue-700' },
}

const TYPE_BORDER: Record<EventType, string> = {
  'Conférence':    'border-l-purple-400',
  'Team Building': 'border-l-emerald-400',
  'Apéritif':      'border-l-orange-400',
  'Autres':        'border-l-blue-400',
}

const FILTERS: { label: string; value: EventType | 'Tous' }[] = [
  { label: 'Tous',          value: 'Tous' },
  { label: 'Conférence',    value: 'Conférence' },
  { label: 'Team Building', value: 'Team Building' },
  { label: 'Apéritif',      value: 'Apéritif' },
  { label: 'Autres',        value: 'Autres' },
]

const SORT_OPTIONS = [
  { label: 'Date (plus récent)', value: 'recent' },
  { label: 'Date (plus ancien)', value: 'oldest' },
  { label: 'Participants',       value: 'participants' },
]

/* ── Composant carte ──────────────────────────────────────────────────── */
function EventRow({
  event,
  userId,
  onParticipationChange,
}: {
  event: Event
  userId: string
  onParticipationChange: (updated: Event | null, id: string) => void
}) {
  const router = useRouter()
  const [participating, setParticipating] = useState(event.participants.includes(userId))
  const [count, setCount]                 = useState(event.participants.length)
  const [loading, setLoading]             = useState(false)

  const typeConf = TYPE_CONFIG[event.type] ?? TYPE_CONFIG['Autres']
  const borderClass = TYPE_BORDER[event.type] ?? TYPE_BORDER['Autres']

  const imageUrl = event.image
    ? event.image.startsWith('http')
      ? event.image
      : `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}${event.image}`
    : null

  const formattedDate = new Date(event.date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const handleParticipation = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setLoading(true)
    try {
      if (participating) {
        await eventsApi.unsubscribe(event._id)
        setParticipating(false)
        setCount((c) => c - 1)
        onParticipationChange(null, event._id)
      } else {
        const updated = await eventsApi.participate(event._id)
        setParticipating(true)
        setCount(updated.participants.length)
        onParticipationChange(updated, event._id)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      onClick={() => router.push(`/events/${event._id}`)}
      className={`flex cursor-pointer items-center gap-5 rounded-2xl border border-[#c1c6d7] border-l-4 ${borderClass} bg-white p-4 transition-shadow hover:shadow-md`}
    >
      {/* Thumbnail */}
      <div className="h-24 w-36 shrink-0 overflow-hidden rounded-xl bg-gray-100">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={event.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center" style={{ background: 'var(--brand-gradient)' }}>
            <CalendarDays className="h-8 w-8 text-white/40" />
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center justify-between gap-3">
          <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${typeConf.className}`}>
            {typeConf.label}
          </span>
          <span className="flex shrink-0 items-center gap-1 text-sm text-[#717786]">
            <Users className="h-3.5 w-3.5" />
            {count} participant{count !== 1 ? 's' : ''}
          </span>
        </div>

        <h3 className="truncate text-lg font-bold text-[#1c1b1b]">{event.title}</h3>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[#414754]">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4 shrink-0 text-[#005ab6]" />
            <span className="capitalize">{formattedDate}{event.time ? ` · ${event.time}` : ''}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 shrink-0 text-[#005ab6]" />
            <span className="line-clamp-1">{event.address}</span>
          </span>
        </div>

        {/* Avatars + bouton */}
        <div className="flex items-center justify-between gap-3">
          {/* Avatar stack (cercles dégradé) */}
          <div className="flex -space-x-2">
            {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
              <div
                key={i}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white"
                style={{ background: 'var(--brand-gradient)' }}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
            {count > 3 && (
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-[10px] font-semibold text-[#414754]">
                +{count - 3}
              </div>
            )}
          </div>

          <Button
            onClick={handleParticipation}
            disabled={loading}
            size="sm"
            className="shrink-0 font-semibold"
            style={participating
              ? { background: 'transparent', border: '1px solid #c1c6d7', color: '#414754' }
              : { background: 'var(--brand-gradient)', border: 'none', color: 'white' }
            }
          >
            {loading ? '…' : participating ? 'Se désinscrire' : 'Participer'}
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────────────── */
export default function MainPage() {
  const { user } = useAuthStore()
  const [events, setEvents]       = useState<Event[]>([])
  const [loading, setLoading]     = useState(true)
  const [activeFilter, setFilter] = useState<EventType | 'Tous'>('Tous')
  const [sort, setSort]           = useState('recent')

  useEffect(() => {
    eventsApi.getAll()
      .then((data) => setEvents(data.filter((e) => e.status === 'published')))
      .finally(() => setLoading(false))
  }, [])

  const filtered = (activeFilter === 'Tous' ? events : events.filter((e) => e.type === activeFilter))
    .slice()
    .sort((a, b) => {
      if (sort === 'oldest')       return new Date(a.date).getTime() - new Date(b.date).getTime()
      if (sort === 'participants')  return b.participants.length - a.participants.length
      return new Date(b.date).getTime() - new Date(a.date).getTime() // recent
    })

  const handleParticipationChange = (updated: Event | null, id: string) => {
    if (!updated) {
      setEvents((prev) => prev.map((e) =>
        e._id === id ? { ...e, participants: e.participants.filter((p) => p !== user?._id) } : e
      ))
    } else {
      setEvents((prev) => prev.map((e) => e._id === updated._id ? updated : e))
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <div className="px-8 py-10">

        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1c1b1b]">Tous les Événements</h1>
          <p className="mt-1 text-sm text-[#717786]">
            Découvrez et gérez les moments forts de votre entreprise.{' '}
            <span className="text-[#005ab6]">Filtrez par catégorie</span> pour trouver votre prochain rassemblement.
          </p>
        </div>

        {/* Filtres + Tri */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
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

          <div className="flex items-center gap-2 text-sm text-[#717786]">
            <span>Trier par :</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-[#c1c6d7] bg-white px-3 py-1.5 text-sm font-medium text-[#414754] focus:outline-none focus:ring-2 focus:ring-[#005ab6]/30"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Liste */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-200" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#c1c6d7] bg-white py-24 text-center">
            <CalendarDays className="mb-3 h-10 w-10 text-[#c1c6d7]" />
            <p className="font-semibold text-[#1c1b1b]">Aucun événement trouvé</p>
            <p className="mt-1 text-sm text-[#717786]">
              {activeFilter === 'Tous'
                ? 'Aucun événement publié pour le moment.'
                : `Aucun événement de type "${activeFilter}".`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((event) => (
              <EventRow
                key={event._id}
                event={event}
                userId={user._id}
                onParticipationChange={handleParticipationChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
