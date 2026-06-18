'use client'

import { useEffect, useState } from 'react'
import { CalendarDays, MapPin, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { eventsApi } from '@/lib/api/events.api'
import type { Event } from '@/lib/types'

/* ── Modal refus ─────────────────────────────────────────────────────── */
function CancelModal({
  event,
  onConfirm,
  onClose,
}: {
  event: Event
  onConfirm: (reason: string) => Promise<void>
  onClose: () => void
}) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleConfirm = async () => {
    if (reason.trim().length < 5) {
      setError('La raison doit faire au moins 5 caractères.')
      return
    }
    setLoading(true)
    await onConfirm(reason.trim())
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-[#1c1b1b]">Refuser l&apos;événement</h3>
        <p className="mt-1 text-sm text-[#717786]">
          <span className="font-medium text-[#1c1b1b]">{event.title}</span> sera marqué comme annulé.
        </p>

        <div className="mt-4 space-y-1.5">
          <label htmlFor="reason" className="text-sm font-medium text-[#1c1b1b]">
            Raison du refus
          </label>
          <textarea
            id="reason"
            rows={3}
            value={reason}
            onChange={(e) => { setReason(e.target.value); setError('') }}
            placeholder="Ex : date déjà prise, budget insuffisant…"
            className="flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {error && <p className="text-xs text-[#ba1a1a]">{error}</p>}
        </div>

        <div className="mt-5 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 font-semibold text-white"
            style={{ background: '#ba1a1a', border: 'none' }}
          >
            {loading ? 'Envoi…' : 'Confirmer le refus'}
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────────────── */
export default function PendingPage() {
  const [events, setEvents]         = useState<Event[]>([])
  const [loading, setLoading]       = useState(true)
  const [cancelTarget, setCancelTarget] = useState<Event | null>(null)
  const [actionId, setActionId]     = useState<string | null>(null)

  useEffect(() => {
    eventsApi.getPending()
      .then(setEvents)
      .finally(() => setLoading(false))
  }, [])

  const handleValidate = async (event: Event) => {
    setActionId(event._id)
    try {
      await eventsApi.validate(event._id)
      setEvents((prev) => prev.filter((e) => e._id !== event._id))
    } finally {
      setActionId(null)
    }
  }

  const handleCancel = async (reason: string) => {
    if (!cancelTarget) return
    setActionId(cancelTarget._id)
    try {
      await eventsApi.cancel(cancelTarget._id, reason)
      setEvents((prev) => prev.filter((e) => e._id !== cancelTarget._id))
      setCancelTarget(null)
    } finally {
      setActionId(null)
    }
  }

  const formattedDate = (date: string) =>
    new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric',
    })

  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <div className="px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1c1b1b]">Événements en attente</h1>
          <p className="mt-1 text-sm text-[#717786]">
            Validez ou refusez les événements soumis par les membres.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-200" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#c1c6d7] bg-white py-20 text-center">
            <Check className="mb-3 h-10 w-10 text-emerald-500" />
            <p className="font-semibold text-[#1c1b1b]">Tout est à jour&nbsp;!</p>
            <p className="mt-1 text-sm text-[#717786]">Aucun événement en attente de validation.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event._id}
                className="flex flex-col gap-4 rounded-2xl border border-orange-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="mb-1 text-xs font-medium uppercase tracking-widest text-orange-600">
                    {event.type}
                  </div>
                  <p className="truncate font-semibold text-[#1c1b1b]">{event.title}</p>
                  <div className="mt-1.5 flex flex-wrap gap-3 text-sm text-[#717786]">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formattedDate(event.date)}{event.time ? ` · ${event.time}` : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {event.address}
                    </span>
                  </div>
                  {event.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-[#414754]">{event.description}</p>
                  )}
                </div>

                <div className="flex shrink-0 gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleValidate(event)}
                    disabled={actionId === event._id}
                    className="gap-1.5 font-semibold text-white"
                    style={{ background: '#15803d', border: 'none' }}
                  >
                    <Check className="h-4 w-4" />
                    Valider
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCancelTarget(event)}
                    disabled={actionId === event._id}
                    className="gap-1.5 border-[#ba1a1a] font-semibold text-[#ba1a1a] hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                    Refuser
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cancelTarget && (
        <CancelModal
          event={cancelTarget}
          onConfirm={handleCancel}
          onClose={() => setCancelTarget(null)}
        />
      )}
    </div>
  )
}
