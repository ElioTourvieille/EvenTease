'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CalendarDays, MapPin, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EventStatusBadge from './EventStatusBadge'
import { eventsApi } from '@/lib/api/events.api'
import type { Event, User } from '@/lib/types'

interface Props {
  event: Event
  currentUser: User
  onParticipationChange?: (updated: Event) => void
}

export default function EventCard({ event, currentUser, onParticipationChange }: Props) {
  const [participating, setParticipating] = useState(
    event.participants.includes(currentUser._id),
  )
  const [participantCount, setParticipantCount] = useState(event.participants.length)
  const [loading, setLoading] = useState(false)

  const handleParticipation = async (e: React.MouseEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (participating) {
        await eventsApi.unsubscribe(event._id)
        const newCount = participantCount - 1
        setParticipating(false)
        setParticipantCount(newCount)
        onParticipationChange?.({ ...event, participants: event.participants.filter((p) => p !== currentUser._id) })
      } else {
        const updated = await eventsApi.participate(event._id)
        setParticipating(true)
        setParticipantCount(updated.participants.length)
        onParticipationChange?.(updated)
      }
    } finally {
      setLoading(false)
    }
  }

  const imageUrl = event.image
    ? event.image.startsWith('http')
      ? event.image
      : `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}${event.image}`
    : null

  const formattedDate = new Date(event.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Link href={`/events/${event._id}`} className="group block">
      <article className="overflow-hidden rounded-2xl border border-[#c1c6d7] bg-white transition-shadow hover:shadow-md">

        {/* Image */}
        <div className="relative h-44 w-full overflow-hidden bg-linear-to-br from-blue-50 to-purple-50">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-white/60"
              style={{ background: 'var(--brand-gradient)' }}
            >
              <CalendarDays className="h-12 w-12 opacity-40" />
            </div>
          )}
          <div className="absolute right-3 top-3">
            <EventStatusBadge status={event.status} />
          </div>
        </div>

        {/* Contenu */}
        <div className="p-5">
          <div className="mb-1 text-xs font-medium uppercase tracking-widest text-[#717786]">
            {event.type}
          </div>
          <h3 className="mb-3 text-base font-semibold text-[#1c1b1b] line-clamp-2 group-hover:text-[#005ab6]">
            {event.title}
          </h3>

          <div className="space-y-1.5 text-sm text-[#414754]">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 shrink-0 text-[#717786]" />
              <span className="capitalize">{formattedDate}{event.time ? ` · ${event.time}` : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-[#717786]" />
              <span className="line-clamp-1">{event.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 shrink-0 text-[#717786]" />
              <span>{participantCount} participant{participantCount !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {event.status === 'published' && (
            <Button
              onClick={handleParticipation}
              disabled={loading}
              size="sm"
              className="mt-4 w-full font-semibold text-white"
              style={participating
                ? { background: 'transparent', border: '1px solid #ba1a1a', color: '#ba1a1a' }
                : { background: 'var(--brand-gradient)', border: 'none' }
              }
            >
              {loading ? '…' : participating ? 'Se désinscrire' : 'Participer'}
            </Button>
          )}
        </div>
      </article>
    </Link>
  )
}
