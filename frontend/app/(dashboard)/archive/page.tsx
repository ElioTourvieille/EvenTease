'use client'

import { useEffect, useState } from 'react'
import { Archive, CalendarDays, MapPin, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { eventsApi } from '@/lib/api/events.api'
import type { Event } from '@/lib/types'

const PAGE_SIZE = 8

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function ArchivePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)

  useEffect(() => {
    eventsApi.getArchived().then(setEvents).finally(() => setLoading(false))
  }, [])

  const pageCount = Math.ceil(events.length / PAGE_SIZE)
  const paginated = events.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const imageUrl = (img?: string) =>
    !img ? null
    : img.startsWith('http') ? img
    : `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}${img}`

  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <div className="px-8 py-10">

        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
              <Archive className="h-5 w-5 text-[#717786]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1c1b1b]">Archives</h1>
              <p className="mt-0.5 text-sm text-[#717786]">
                Événements passés de votre organisation.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-2xl bg-gray-200" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#c1c6d7] bg-white py-24 text-center">
            <Archive className="mb-3 h-10 w-10 text-[#c1c6d7]" />
            <p className="font-semibold text-[#1c1b1b]">Aucun événement passé pour le moment</p>
            <p className="mt-1 text-sm text-[#717786]">
              Les événements publiés dont la date est dépassée apparaîtront ici.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#c1c6d7] bg-white">

            {/* En-tête tableau */}
            <div className="flex items-center justify-between border-b border-[#c1c6d7] px-5 py-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#717786]">
                Événements archivés
              </p>
              <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-[#717786]">
                {events.length} au total
              </span>
            </div>

            {/* Colonnes */}
            <div className="grid grid-cols-12 gap-3 border-b border-[#c1c6d7] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#717786]">
              <span className="col-span-4">Événement</span>
              <span className="col-span-3">Lieu</span>
              <span className="col-span-2">Date</span>
              <span className="col-span-2">Participants</span>
              <span className="col-span-1">Statut</span>
            </div>

            {paginated.map((event) => {
              const thumb = imageUrl(event.image)
              return (
                <div
                  key={event._id}
                  className="grid grid-cols-12 items-center gap-3 border-b border-[#c1c6d7] px-5 py-4 last:border-0"
                >
                  {/* Événement */}
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      {thumb
                        // eslint-disable-next-line @next/next/no-img-element
                        ? <img src={thumb} alt="" className="h-full w-full object-cover opacity-70 grayscale" />
                        : <div className="flex h-full w-full items-center justify-center">
                            <CalendarDays className="h-4 w-4 text-[#c1c6d7]" />
                          </div>
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#414754]">{event.title}</p>
                      <p className="text-xs text-[#717786]">{event.type}</p>
                    </div>
                  </div>

                  {/* Lieu */}
                  <div className="col-span-3 min-w-0">
                    <p className="flex items-start gap-1 text-sm text-[#717786]">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      <span className="line-clamp-2">{event.address}</span>
                    </p>
                  </div>

                  {/* Date */}
                  <div className="col-span-2">
                    <p className="text-sm text-[#717786]">{fmt(event.date)}</p>
                    {event.time && <p className="text-xs text-[#717786]">{event.time}</p>}
                  </div>

                  {/* Participants */}
                  <div className="col-span-2 flex items-center gap-1.5 text-sm text-[#717786]">
                    <Users className="h-3.5 w-3.5 shrink-0" />
                    {event.participants.length}
                  </div>

                  {/* Badge Terminé */}
                  <div className="col-span-1">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-[#717786]">
                      Terminé
                    </span>
                  </div>
                </div>
              )
            })}

            {/* Pagination */}
            {pageCount > 1 && (
              <div className="flex items-center justify-between border-t border-[#c1c6d7] px-5 py-3">
                <p className="text-sm text-[#717786]">
                  {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, events.length)} sur {events.length}
                </p>
                <div className="flex gap-1">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage(page - 1)}
                    className="rounded-lg border border-[#c1c6d7] p-1.5 text-[#717786] disabled:opacity-40 hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    disabled={page >= pageCount - 1}
                    onClick={() => setPage(page + 1)}
                    className="rounded-lg border border-[#c1c6d7] p-1.5 text-[#717786] disabled:opacity-40 hover:bg-gray-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
