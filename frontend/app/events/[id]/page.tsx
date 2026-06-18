'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, CalendarDays, Clock, MapPin, Users, Tag, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EventStatusBadge from '@/components/events/EventStatusBadge'
import { eventsApi } from '@/lib/api/events.api'
import { useAuthStore } from '@/lib/store/auth.store'
import type { Event } from '@/lib/types'

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuthStore()

  const [event, setEvent]       = useState<Event | null>(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    eventsApi.getById(id)
      .then(setEvent)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  const isParticipating = user ? event?.participants.includes(user._id) ?? false : false

  const handleParticipation = async () => {
    if (!event || !user) return
    setActionLoading(true)
    try {
      if (isParticipating) {
        await eventsApi.unsubscribe(event._id)
        setEvent({ ...event, participants: event.participants.filter((p) => p !== user._id) })
      } else {
        const updated = await eventsApi.participate(event._id)
        setEvent(updated)
      }
    } finally {
      setActionLoading(false)
    }
  }

  const imageUrl = event?.image
    ? event.image.startsWith('http')
      ? event.image
      : `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}${event.image}`
    : null

  const formattedDate = event
    ? new Date(event.date).toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : ''

  const mapsUrl = event
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_MAPS_API_KEY ?? ''}&q=${encodeURIComponent(event.address)}`
    : ''

  /* ── États ────────────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcf9f8]">
        <div className="mx-auto max-w-4xl px-6 py-10 space-y-6">
          <div className="h-8 w-32 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-72 animate-pulse rounded-2xl bg-gray-200" />
          <div className="space-y-3">
            <div className="h-6 w-2/3 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#fcf9f8]">
        <p className="text-lg font-medium text-[#414754]">Événement introuvable.</p>
        <Button onClick={() => router.back()} variant="outline">Retour</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <div className="mx-auto max-w-4xl px-6 py-10">

        {/* Retour */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-1.5 cursor-pointer text-sm font-medium text-[#414754] hover:text-[#005ab6]"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>

        {/* Image hero */}
        <div className="mb-8 overflow-hidden rounded-2xl">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={event.title} className="h-72 w-full object-cover" />
          ) : (
            <div
              className="flex h-72 w-full items-center justify-center"
              style={{ background: 'var(--brand-gradient)' }}
            >
              <CalendarDays className="h-16 w-16 text-white/40" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <EventStatusBadge status={event.status} />
                <span className="rounded-full border border-[#c1c6d7] px-2.5 py-0.5 text-xs font-medium text-[#414754]">
                  {event.type}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[#1c1b1b]">{event.title}</h1>
            </div>

            {/* Infos */}
            <div className="space-y-3 rounded-2xl border border-[#c1c6d7] bg-white p-5">
              <div className="flex items-center gap-3 text-sm text-[#414754]">
                <CalendarDays className="h-4 w-4 shrink-0 text-[#005ab6]" />
                <span className="capitalize">{formattedDate}</span>
              </div>
              {event.time && (
                <div className="flex items-center gap-3 text-sm text-[#414754]">
                  <Clock className="h-4 w-4 shrink-0 text-[#005ab6]" />
                  <span>{event.time}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-[#414754]">
                <MapPin className="h-4 w-4 shrink-0 text-[#005ab6]" />
                <span>{event.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#414754]">
                <Users className="h-4 w-4 shrink-0 text-[#005ab6]" />
                <span>
                  {event.participants.length} participant{event.participants.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#414754]">
                <Lock className="h-4 w-4 shrink-0 text-[#005ab6]" />
                <span>{event.invitation}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#414754]">
                <Tag className="h-4 w-4 shrink-0 text-[#005ab6]" />
                <span>{event.type}</span>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div>
                <h2 className="mb-2 text-base font-semibold text-[#1c1b1b]">Description</h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-[#414754]">
                  {event.description}
                </p>
              </div>
            )}

            {/* Raison annulation */}
            {event.status === 'cancelled' && event.cancelReason && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm font-medium text-[#ba1a1a]">Raison de l&apos;annulation</p>
                <p className="mt-1 text-sm text-[#414754]">{event.cancelReason}</p>
              </div>
            )}

            {/* Google Maps */}
            {process.env.NEXT_PUBLIC_MAPS_API_KEY ? (
              <div>
                <h2 className="mb-2 text-base font-semibold text-[#1c1b1b]">Localisation</h2>
                <iframe
                  title="Localisation de l'événement"
                  src={mapsUrl}
                  className="h-56 w-full rounded-2xl border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <div>
                <h2 className="mb-2 text-base font-semibold text-[#1c1b1b]">Localisation</h2>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#005ab6] hover:underline"
                >
                  <MapPin className="h-4 w-4" />
                  Voir sur Google Maps — {event.address}
                </a>
              </div>
            )}
          </div>

          {/* Colonne latérale */}
          <div className="space-y-4">
            {event.status === 'published' && user && (
              <Button
                onClick={handleParticipation}
                disabled={actionLoading}
                className="w-full font-semibold text-white"
                style={isParticipating
                  ? { background: 'transparent', border: '1px solid #ba1a1a', color: '#ba1a1a' }
                  : { background: 'var(--brand-gradient)', border: 'none' }
                }
              >
                {actionLoading ? '…' : isParticipating ? 'Se désinscrire' : 'Participer'}
              </Button>
            )}

            <div className="rounded-2xl border border-[#c1c6d7] bg-white p-4">
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#717786]">
                Participants ({event.participants.length})
              </p>
              {event.participants.length === 0 ? (
                <p className="text-sm text-[#717786]">Aucun participant pour l&apos;instant.</p>
              ) : (
                <p className="text-sm text-[#414754]">
                  {event.participants.length} personne{event.participants.length !== 1 ? 's' : ''} inscrite{event.participants.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
