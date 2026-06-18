'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, CalendarDays, MapPin, Clock, FileText, Tag, Lock, Image } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { eventsApi } from '@/lib/api/events.api'
import apiClient from '@/lib/api/client'
import { useAuthStore } from '@/lib/store/auth.store'
import { canDeleteEvent } from '@/lib/utils/permissions'
import type { Event, EventType, EventAccess } from '@/lib/types'

/* ── Zod ──────────────────────────────────────────────────────────────── */
const schema = z.object({
  title:       z.string().min(3, 'Au moins 3 caractères'),
  type:        z.enum(['Team Building', 'Conférence', 'Apéritif', 'Autres'], { message: 'Sélectionnez un type' }),
  invitation:  z.enum(['Ouvert à tous', 'Equipe de direction', 'Service concerné'], { message: 'Sélectionnez un accès' }),
  date:        z.string().min(1, { message: 'La date est requise' }),
  time:        z.string().min(1, { message: "L'heure est requise" }),
  address:     z.string().min(3, 'Au moins 3 caractères'),
  description: z.string().min(10, 'Au moins 10 caractères'),
})

type FormData = z.infer<typeof schema>

export default function EventEditPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuthStore()

  const [event, setEvent]         = useState<Event | null>(null)
  const [loading, setLoading]     = useState(true)
  const [serverError, setServerError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  useEffect(() => {
    eventsApi.getById(id)
      .then((e) => {
        setEvent(e)
        reset({
          title:       e.title,
          type:        e.type,
          invitation:  e.invitation,
          date:        e.date,
          time:        e.time,
          address:     e.address,
          description: e.description,
        })
      })
      .catch(() => router.replace('/myevents'))
      .finally(() => setLoading(false))
  }, [id, reset, router])

  const canEdit = user && event
    ? canDeleteEvent(user.role, user._id, event.createdBy)
    : false

  const uploadImage = async (file: File): Promise<string> => {
    const form = new FormData()
    form.append('file', file)
    const res = await apiClient.post<{ url: string }>('/uploads/event-image', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.url
  }

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    try {
      let imageUrl: string | undefined
      if (imageFile) imageUrl = await uploadImage(imageFile)

      await eventsApi.update(id, {
        ...data,
        type: data.type as EventType,
        invitation: data.invitation as EventAccess,
        ...(imageUrl ? { image: imageUrl } : undefined),
      })
      router.replace(`/events/${id}`)
    } catch {
      setServerError('Une erreur est survenue. Veuillez réessayer.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcf9f8] px-6 py-10">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-96 animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>
    )
  }

  if (!canEdit) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#fcf9f8]">
        <p className="text-sm text-[#717786]">Vous n&apos;êtes pas autorisé à modifier cet événement.</p>
        <Button variant="outline" onClick={() => router.back()}>Retour</Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <div className="mx-auto max-w-2xl px-6 py-10">

        <button
          onClick={() => router.back()}
          className="mb-6 flex cursor-pointer items-center gap-1.5 text-sm font-medium text-[#414754] hover:text-[#005ab6]"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1c1b1b]">Modifier l&apos;événement</h1>
          <p className="mt-1 text-sm text-[#717786]">{event?.title}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="rounded-2xl border border-[#c1c6d7] bg-white p-6 space-y-5">

            {/* Titre */}
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-sm font-medium text-[#1c1b1b]">Titre</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717786]" />
                <Input id="title" className="pl-10" {...register('title')} />
              </div>
              {errors.title && <p className="text-xs text-[#ba1a1a]">{errors.title.message}</p>}
            </div>

            {/* Type + Accès */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="type" className="flex items-center gap-1.5 text-sm font-medium text-[#1c1b1b]">
                  <Tag className="h-3.5 w-3.5 text-[#717786]" /> Type
                </label>
                <select id="type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" {...register('type')}>
                  <option value="Team Building">Team Building</option>
                  <option value="Conférence">Conférence</option>
                  <option value="Apéritif">Apéritif</option>
                  <option value="Autres">Autres</option>
                </select>
                {errors.type && <p className="text-xs text-[#ba1a1a]">{errors.type.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="invitation" className="flex items-center gap-1.5 text-sm font-medium text-[#1c1b1b]">
                  <Lock className="h-3.5 w-3.5 text-[#717786]" /> Accès
                </label>
                <select id="invitation" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" {...register('invitation')}>
                  <option value="Ouvert à tous">Ouvert à tous</option>
                  <option value="Equipe de direction">Equipe de direction</option>
                  <option value="Service concerné">Service concerné</option>
                </select>
                {errors.invitation && <p className="text-xs text-[#ba1a1a]">{errors.invitation.message}</p>}
              </div>
            </div>

            {/* Date + Heure */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="date" className="flex items-center gap-1.5 text-sm font-medium text-[#1c1b1b]">
                  <CalendarDays className="h-3.5 w-3.5 text-[#717786]" /> Date
                </label>
                <Input id="date" type="date" {...register('date')} />
                {errors.date && <p className="text-xs text-[#ba1a1a]">{errors.date.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="time" className="flex items-center gap-1.5 text-sm font-medium text-[#1c1b1b]">
                  <Clock className="h-3.5 w-3.5 text-[#717786]" /> Heure
                </label>
                <Input id="time" type="time" {...register('time')} />
                {errors.time && <p className="text-xs text-[#ba1a1a]">{errors.time.message}</p>}
              </div>
            </div>

            {/* Adresse */}
            <div className="space-y-1.5">
              <label htmlFor="address" className="flex items-center gap-1.5 text-sm font-medium text-[#1c1b1b]">
                <MapPin className="h-3.5 w-3.5 text-[#717786]" /> Adresse
              </label>
              <Input id="address" {...register('address')} />
              {errors.address && <p className="text-xs text-[#ba1a1a]">{errors.address.message}</p>}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label htmlFor="description" className="text-sm font-medium text-[#1c1b1b]">Description</label>
              <textarea
                id="description"
                rows={4}
                className="flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register('description')}
              />
              {errors.description && <p className="text-xs text-[#ba1a1a]">{errors.description.message}</p>}
            </div>

            {/* Image */}
            <div className="space-y-1.5">
              <label htmlFor="image" className="flex items-center gap-1.5 text-sm font-medium text-[#1c1b1b]">
                <Image className="h-3.5 w-3.5 text-[#717786]" /> Changer l&apos;image (optionnel)
              </label>
              {event?.image && (
                <p className="text-xs text-[#717786]">Image actuelle : {event.image}</p>
              )}
              <input
                id="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
              />
              <p className="text-xs text-[#717786]">Laisser vide pour conserver l&apos;image actuelle</p>
            </div>
          </div>

          {serverError && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-[#ba1a1a]">{serverError}</div>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 font-semibold text-white"
              style={{ background: 'var(--brand-gradient)', border: 'none' }}
            >
              {isSubmitting ? 'Sauvegarde…' : 'Sauvegarder les modifications'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
