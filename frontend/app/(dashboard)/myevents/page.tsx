'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CalendarDays, MapPin, Pencil, Trash2, Plus, Users, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EventStatusBadge from '@/components/events/EventStatusBadge'
import { eventsApi } from '@/lib/api/events.api'
import { canDeleteEvent } from '@/lib/utils/permissions'
import { useAuthStore } from '@/lib/store/auth.store'
import type { Event } from '@/lib/types'

const PAGE_SIZE = 5

/* ── Modal confirmation suppression ──────────────────────────────────── */
function DeleteModal({ event, onConfirm, onClose }: { event: Event; onConfirm: () => Promise<void>; onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-[#1c1b1b]">Supprimer l&apos;événement&nbsp;?</h3>
        <p className="mt-2 text-sm text-[#717786]">
          <span className="font-medium text-[#1c1b1b]">{event.title}</span> sera supprimé définitivement.
        </p>
        <div className="mt-5 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>Annuler</Button>
          <Button onClick={async () => { setLoading(true); await onConfirm(); setLoading(false) }} disabled={loading}
            className="flex-1 font-semibold text-white" style={{ background: '#ba1a1a', border: 'none' }}>
            {loading ? 'Suppression…' : 'Supprimer'}
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ── Helpers ─────────────────────────────────────────────────────────── */
function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

/* ── Page ─────────────────────────────────────────────────────────────── */
export default function MyEventsPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [events, setEvents]             = useState<Event[]>([])
  const [loading, setLoading]           = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null)
  const [page, setPage]                 = useState(0)

  useEffect(() => {
    eventsApi.getMine().then(setEvents).finally(() => setLoading(false))
  }, [])

  const handleDelete = async () => {
    if (!deleteTarget) return
    await eventsApi.delete(deleteTarget._id)
    setEvents((prev) => prev.filter((e) => e._id !== deleteTarget._id))
    setDeleteTarget(null)
  }

  /* Calculs dérivés */
  const upcoming = events
    .filter((e) => e.status === 'published' && new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const featured = upcoming[0] ?? null
  const totalParticipants = events.reduce((acc, e) => acc + e.participants.length, 0)
  const publishedCount = events.filter((e) => e.status === 'published').length
  const pendingCount = events.filter((e) => e.status === 'pending').length
  const engagementRate = publishedCount > 0 ? Math.round((totalParticipants / publishedCount) * 10) : 0

  const pageCount = Math.ceil(events.length / PAGE_SIZE)
  const paginated = events.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const imageUrl = (img?: string) => !img ? null
    : img.startsWith('http') ? img
    : `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}${img}`

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <div className="px-8 py-10">

        {/* En-tête */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1c1b1b]">Mes Événements</h1>
            <p className="mt-1 text-sm text-[#717786]">
              Gérez vos événements et suivez leur évolution en temps réel.
            </p>
          </div>
          <Link href="/events/create">
            <Button className="shrink-0 gap-2 font-semibold text-white" style={{ background: 'var(--brand-gradient)', border: 'none' }}>
              <Plus className="h-4 w-4" /> Nouvel Event
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-200" />)}
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#c1c6d7] bg-white py-24 text-center">
            <CalendarDays className="mb-3 h-10 w-10 text-[#c1c6d7]" />
            <p className="font-semibold text-[#1c1b1b]">Aucun événement créé</p>
            <p className="mt-1 text-sm text-[#717786]">Créez votre premier événement pour commencer.</p>
            <Link href="/events/create" className="mt-4">
              <Button size="sm" className="font-semibold text-white" style={{ background: 'var(--brand-gradient)', border: 'none' }}>
                Créer un événement
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Featured + Engagement */}
            <div className="mb-6 grid grid-cols-1 gap-5 lg:grid-cols-3">

              {/* Featured event */}
              <div
                className="relative col-span-2 overflow-hidden rounded-2xl p-6 text-white"
                style={{ background: 'var(--brand-gradient)', minHeight: '180px' }}
              >
                {featured?.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl(featured.image) ?? ''} alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-20" />
                )}
                <div className="relative z-10">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
                    {featured ? 'Prochain grand rendez-vous' : 'Aucun événement à venir'}
                  </p>
                  {featured ? (
                    <>
                      <h2 className="mt-1 text-2xl font-bold">{featured.title}</h2>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
                        <MapPin className="h-3.5 w-3.5" />{featured.address}
                      </p>
                      <div className="mt-4 flex gap-8">
                        <div>
                          <p className="text-2xl font-bold">{featured.participants.length.toLocaleString('fr-FR')}</p>
                          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Inscrits</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">{daysUntil(featured.date)}</p>
                          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Jours restants</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-white/80">Tous vos événements sont passés ou annulés.</p>
                  )}
                </div>
              </div>

              {/* Engagement */}
              <div className="rounded-2xl border border-[#c1c6d7] bg-white p-6">
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-sm font-medium text-[#717786]">Taux d&apos;engagement</p>
                <p className="mt-0.5 text-xs text-[#717786]">Moyenne sur vos événements publiés.</p>
                <p className="mt-3 text-4xl font-bold text-[#1c1b1b]">
                  {engagementRate}
                  <span className="text-xl text-[#717786]">%</span>
                </p>
                <p className="mt-1 text-xs text-emerald-600">
                  {totalParticipants} participant{totalParticipants !== 1 ? 's' : ''} au total
                </p>
              </div>
            </div>

            {/* Tableau */}
            <div className="overflow-hidden rounded-2xl border border-[#c1c6d7] bg-white">
              <div className="flex items-center justify-between border-b border-[#c1c6d7] px-5 py-4">
                <p className="text-sm font-semibold uppercase tracking-wider text-[#717786]">
                  Liste des événements
                </p>
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  {publishedCount} Actif{publishedCount !== 1 ? 's' : ''}
                </span>
              </div>

              {/* En-tête colonnes */}
              <div className="grid grid-cols-12 gap-3 border-b border-[#c1c6d7] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#717786]">
                <span className="col-span-4">Événement</span>
                <span className="col-span-3">Lieu &amp; Adresse</span>
                <span className="col-span-2">Date</span>
                <span className="col-span-2">Statut</span>
                <span className="col-span-1 text-right">Actions</span>
              </div>

              {paginated.map((event) => {
                const thumb = imageUrl(event.image)
                const canDel = canDeleteEvent(user.role, user._id, event.createdBy)
                return (
                  <div key={event._id} className="grid grid-cols-12 items-center gap-3 border-b border-[#c1c6d7] px-5 py-4 last:border-0">

                    {/* Événement */}
                    <div className="col-span-4 flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-blue-50">
                        {thumb
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={thumb} alt="" className="h-full w-full object-cover" />
                          : <div className="flex h-full w-full items-center justify-center" style={{ background: 'var(--brand-gradient)' }}>
                              <CalendarDays className="h-4 w-4 text-white/60" />
                            </div>
                        }
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#1c1b1b]">{event.title}</p>
                        <p className="text-xs text-[#717786]">{event.type}</p>
                      </div>
                    </div>

                    {/* Lieu */}
                    <div className="col-span-3 min-w-0">
                      <p className="flex items-start gap-1 text-sm text-[#414754]">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#717786]" />
                        <span className="line-clamp-2">{event.address}</span>
                      </p>
                    </div>

                    {/* Date */}
                    <div className="col-span-2">
                      <p className="text-sm text-[#414754]">{fmt(event.date)}</p>
                      {event.time && <p className="text-xs text-[#717786]">{event.time}</p>}
                    </div>

                    {/* Statut */}
                    <div className="col-span-2">
                      <EventStatusBadge status={event.status} />
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center justify-end gap-1">
                      <button
                        onClick={() => router.push(`/events/${event._id}/edit`)}
                        title="Modifier"
                        className="rounded-lg p-1.5 text-[#717786] transition-colors hover:bg-blue-50 hover:text-[#005ab6]"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      {canDel && (
                        <button
                          onClick={() => setDeleteTarget(event)}
                          title="Supprimer"
                          className="rounded-lg p-1.5 text-[#717786] transition-colors hover:bg-red-50 hover:text-[#ba1a1a]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Pagination */}
              {pageCount > 1 && (
                <div className="flex items-center justify-between border-t border-[#c1c6d7] px-5 py-3">
                  <p className="text-sm text-[#717786]">
                    Affichage de {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, events.length)} sur {events.length} événements
                  </p>
                  <div className="flex gap-1">
                    <button disabled={page === 0} onClick={() => setPage(page - 1)}
                      className="rounded-lg border border-[#c1c6d7] p-1.5 text-[#717786] disabled:opacity-40 hover:bg-gray-50">
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button disabled={page >= pageCount - 1} onClick={() => setPage(page + 1)}
                      className="rounded-lg border border-[#c1c6d7] p-1.5 text-[#717786] disabled:opacity-40 hover:bg-gray-50">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Stats bas de page */}
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { icon: <Users className="h-5 w-5" />, label: 'Total Participants', value: totalParticipants.toLocaleString('fr-FR'), color: 'text-[#005ab6] bg-blue-50' },
                { icon: <CalendarDays className="h-5 w-5" />, label: 'Événements Publiés', value: publishedCount, color: 'text-emerald-600 bg-emerald-50' },
                { icon: <CalendarDays className="h-5 w-5" />, label: 'En attente', value: pendingCount, color: 'text-orange-600 bg-orange-50' },
                { icon: <TrendingUp className="h-5 w-5" />, label: 'Total créés', value: events.length, color: 'text-purple-600 bg-purple-50' },
              ].map(({ icon, label, value, color }) => (
                <div key={label} className="rounded-2xl border border-[#c1c6d7] bg-white p-5">
                  <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${color}`}>{icon}</div>
                  <p className="text-xs text-[#717786]">{label}</p>
                  <p className="mt-1 text-2xl font-bold text-[#1c1b1b]">{value}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {deleteTarget && (
        <DeleteModal event={deleteTarget} onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} />
      )}
    </div>
  )
}
