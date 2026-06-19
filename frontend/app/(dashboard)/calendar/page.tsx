'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { eventsApi } from '@/lib/api/events.api'
import { useAuthStore } from '@/lib/store/auth.store'
import type { Event, EventType } from '@/lib/types'

/* ── Couleurs par type ────────────────────────────────────────────────── */
const TYPE_DOT: Record<EventType, string> = {
  'Conférence':    'bg-purple-500',
  'Team Building': 'bg-emerald-500',
  'Apéritif':      'bg-orange-500',
  'Autres':        'bg-blue-500',
}

const TYPE_PILL: Record<EventType, string> = {
  'Conférence':    'bg-purple-100 text-purple-700',
  'Team Building': 'bg-emerald-100 text-emerald-700',
  'Apéritif':      'bg-orange-100 text-orange-700',
  'Autres':        'bg-blue-100 text-blue-700',
}

const DAYS_FR  = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
]

/* ── Helpers ─────────────────────────────────────────────────────────── */
function isoDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function eventIsoDate(e: Event) {
  // e.date peut être "2026-06-19" ou un ISO complet
  return e.date.slice(0, 10)
}

/* ── Page ─────────────────────────────────────────────────────────────── */
export default function CalendarPage() {
  const { user } = useAuthStore()
  const router = useRouter()

  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth()) // 0-based
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const isManager = user?.role === 'owner' || user?.role === 'admin'

  useEffect(() => {
    eventsApi.getAll()
      .then((data) => setEvents(data.filter((e) => e.status === 'published')))
      .finally(() => setLoading(false))
  }, [])

  /* Navigation */
  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  /* Grille calendrier */
  const { cells } = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay() // 0=Sun
    // Convertir Sunday-first → Monday-first
    const startOffset = (firstDay + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const daysInPrev  = new Date(year, month, 0).getDate()

    const cells: { day: number; isCurrentMonth: boolean; date: string }[] = []

    // Jours du mois précédent
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = daysInPrev - i
      const prevM = month === 0 ? 11 : month - 1
      const prevY = month === 0 ? year - 1 : year
      cells.push({ day: d, isCurrentMonth: false, date: isoDate(prevY, prevM, d) })
    }
    // Jours du mois courant
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ day: d, isCurrentMonth: true, date: isoDate(year, month, d) })
    }
    // Jours du mois suivant (compléter jusqu'à multiple de 7)
    let next = 1
    while (cells.length % 7 !== 0) {
      const nextM = month === 11 ? 0 : month + 1
      const nextY = month === 11 ? year + 1 : year
      cells.push({ day: next++, isCurrentMonth: false, date: isoDate(nextY, nextM, next - 1) })
    }
    return { cells }
  }, [year, month])

  /* Index events par date */
  const eventsByDate = useMemo(() => {
    const map: Record<string, Event[]> = {}
    for (const e of events) {
      const d = eventIsoDate(e)
      if (!map[d]) map[d] = []
      map[d]!.push(e)
    }
    return map
  }, [events])

  const todayIso = isoDate(today.getFullYear(), today.getMonth(), today.getDate())

  const handleCellClick = (date: string, hasEvents: boolean) => {
    if (hasEvents) return // les events ont leur propre onClick
    if (isManager) router.push('/events/create')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <div className="px-8 py-10">

        {/* En-tête */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1c1b1b]">Calendrier</h1>
            <p className="mt-1 text-sm text-[#717786]">
              Événements publiés de votre organisation.
            </p>
          </div>

          {/* Navigation mois */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevMonth}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c1c6d7] bg-white text-[#414754] transition-colors hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[160px] text-center text-base font-semibold text-[#1c1b1b]">
              {MONTHS_FR[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c1c6d7] bg-white text-[#414754] transition-colors hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Légende types */}
        <div className="mb-4 flex flex-wrap gap-3">
          {(Object.entries(TYPE_DOT) as [EventType, string][]).map(([type, dot]) => (
            <span key={type} className="flex items-center gap-1.5 text-xs text-[#414754]">
              <span className={`h-2 w-2 rounded-full ${dot}`} />
              {type}
            </span>
          ))}
          {isManager && (
            <span className="ml-auto text-xs text-[#717786]">
              Cliquez sur une cellule vide pour créer un événement
            </span>
          )}
        </div>

        {/* Grille */}
        <div className="overflow-hidden rounded-2xl border border-[#c1c6d7] bg-white">

          {/* Jours de la semaine */}
          <div className="grid grid-cols-7 border-b border-[#c1c6d7]">
            {DAYS_FR.map((d) => (
              <div key={d} className="py-3 text-center text-xs font-semibold uppercase tracking-wider text-[#717786]">
                {d}
              </div>
            ))}
          </div>

          {/* Cellules */}
          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#005ab6] border-t-transparent" />
            </div>
          ) : (
            <div className="grid grid-cols-7">
              {cells.map((cell, i) => {
                const dayEvents = eventsByDate[cell.date] ?? []
                const isToday   = cell.date === todayIso && cell.isCurrentMonth
                const isLast    = i >= cells.length - 7

                return (
                  <div
                    key={`${cell.date}-${i}`}
                    onClick={() => cell.isCurrentMonth && handleCellClick(cell.date, false)}
                    className={[
                      'min-h-[100px] border-b border-r border-[#c1c6d7] p-2',
                      isLast ? 'border-b-0' : '',
                      (i + 1) % 7 === 0 ? 'border-r-0' : '',
                      !cell.isCurrentMonth ? 'bg-gray-50' : '',
                      cell.isCurrentMonth && isManager && dayEvents.length === 0
                        ? 'cursor-pointer hover:bg-blue-50/40'
                        : '',
                    ].join(' ')}
                  >
                    {/* Numéro du jour */}
                    <div className="mb-1 flex items-center justify-between">
                      <span
                        className={[
                          'flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium',
                          isToday
                            ? 'font-bold text-white'
                            : cell.isCurrentMonth
                              ? 'text-[#1c1b1b]'
                              : 'text-[#c1c6d7]',
                        ].join(' ')}
                        style={isToday ? { background: 'var(--brand-gradient)' } : {}}
                      >
                        {cell.day}
                      </span>
                    </div>

                    {/* Events */}
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 3).map((event) => (
                        <button
                          key={event._id}
                          onClick={(e) => { e.stopPropagation(); router.push(`/events/${event._id}`) }}
                          className={[
                            'w-full truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium transition-opacity hover:opacity-80',
                            TYPE_PILL[event.type] ?? TYPE_PILL['Autres'],
                          ].join(' ')}
                          title={`${event.title}${event.time ? ` · ${event.time}` : ''}`}
                        >
                          {event.time ? `${event.time} ` : ''}{event.title}
                        </button>
                      ))}
                      {dayEvents.length > 3 && (
                        <p className="pl-1 text-[10px] text-[#717786]">
                          +{dayEvents.length - 3} autre{dayEvents.length - 3 > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Événements du mois en bas */}
        {!loading && (() => {
          const monthEvents = events.filter((e) => {
            const d = new Date(e.date)
            return d.getFullYear() === year && d.getMonth() === month
          }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

          if (monthEvents.length === 0) return null

          return (
            <div className="mt-6">
              <h2 className="mb-3 text-sm font-semibold text-[#1c1b1b]">
                {monthEvents.length} événement{monthEvents.length > 1 ? 's' : ''} en {MONTHS_FR[month]}
              </h2>
              <div className="space-y-2">
                {monthEvents.map((event) => (
                  <button
                    key={event._id}
                    onClick={() => router.push(`/events/${event._id}`)}
                    className="flex w-full items-center gap-4 rounded-xl border border-[#c1c6d7] bg-white px-4 py-3 text-left transition-shadow hover:shadow-sm"
                  >
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${TYPE_DOT[event.type] ?? 'bg-blue-500'}`} />
                    <span className="flex-1 truncate text-sm font-medium text-[#1c1b1b]">{event.title}</span>
                    <span className="shrink-0 text-xs text-[#717786]">
                      {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      {event.time ? ` · ${event.time}` : ''}
                    </span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_PILL[event.type] ?? TYPE_PILL['Autres']}`}>
                      {event.type}
                    </span>
                    <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#005ab6]" />
                  </button>
                ))}
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
