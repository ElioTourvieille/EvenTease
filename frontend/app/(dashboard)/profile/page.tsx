'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Lock, Building2, Shield, Camera, Eye, EyeOff, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { usersApi } from '@/lib/api/users.api'
import { organizationsApi } from '@/lib/api/organizations.api'
import { useAuthStore } from '@/lib/store/auth.store'
import type { Organization, UserRole } from '@/lib/types'

/* ── Rôle badge ────────────────────────────────────────────────────────── */
const ROLE_CONFIG: Record<UserRole, { label: string; className: string }> = {
  owner:  { label: 'Owner',  className: 'bg-purple-100 text-purple-700' },
  admin:  { label: 'Admin',  className: 'bg-blue-100 text-blue-700' },
  member: { label: 'Membre', className: 'bg-gray-100 text-gray-600' },
}

/* ── Schéma Zod ────────────────────────────────────────────────────────── */
const schema = z.object({
  email:           z.string().email({ message: 'Email invalide' }).optional().or(z.literal('')),
  password:        z.string().min(8, { message: 'Minimum 8 caractères' }).optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
}).refine(
  (d) => !d.password || d.password === d.confirmPassword,
  { message: 'Les mots de passe ne correspondent pas', path: ['confirmPassword'] },
)

type FormData = z.infer<typeof schema>

/* ── Modal édition ─────────────────────────────────────────────────────── */
function EditModal({ currentEmail, onClose, onSaved }: {
  currentEmail: string
  onClose: () => void
  onSaved: (newEmail?: string) => void
}) {
  const [showPwd, setShowPwd]   = useState(false)
  const [showConf, setShowConf] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: currentEmail, password: '', confirmPassword: '' },
  })

  const onSubmit = async (data: FormData) => {
    const payload: { email?: string; password?: string } = {}
    if (data.email && data.email !== currentEmail) payload.email = data.email
    if (data.password) payload.password = data.password

    if (Object.keys(payload).length === 0) {
      toast.info('Aucune modification détectée')
      return
    }

    try {
      await usersApi.updateMe(payload)
      toast.success('Profil mis à jour')
      onSaved(payload.email)
    } catch {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1c1b1b]">Modifier le profil</h2>
          <button onClick={onClose} className="rounded-lg p-1 text-[#717786] hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#1c1b1b]">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717786]" />
              <input
                {...register('email')}
                type="email"
                placeholder="votre@email.com"
                className="w-full rounded-xl border border-[#c1c6d7] bg-white py-2.5 pl-9 pr-4 text-sm text-[#1c1b1b] placeholder:text-[#717786] focus:border-[#005ab6] focus:outline-none focus:ring-2 focus:ring-[#005ab6]/20"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Nouveau mot de passe */}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#1c1b1b]">Nouveau mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717786]" />
              <input
                {...register('password')}
                type={showPwd ? 'text' : 'password'}
                placeholder="Laisser vide pour ne pas modifier"
                className="w-full rounded-xl border border-[#c1c6d7] bg-white py-2.5 pl-9 pr-10 text-sm text-[#1c1b1b] placeholder:text-[#717786] focus:border-[#005ab6] focus:outline-none focus:ring-2 focus:ring-[#005ab6]/20"
              />
              <button type="button" onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717786]">
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {/* Confirmation */}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#1c1b1b]">Confirmer le mot de passe</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717786]" />
              <input
                {...register('confirmPassword')}
                type={showConf ? 'text' : 'password'}
                placeholder="Répétez le nouveau mot de passe"
                className="w-full rounded-xl border border-[#c1c6d7] bg-white py-2.5 pl-9 pr-10 text-sm text-[#1c1b1b] placeholder:text-[#717786] focus:border-[#005ab6] focus:outline-none focus:ring-2 focus:ring-[#005ab6]/20"
              />
              <button type="button" onClick={() => setShowConf((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717786]">
                {showConf ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isSubmitting}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 font-semibold text-white"
              style={{ background: 'var(--brand-gradient)', border: 'none' }}
            >
              {isSubmitting ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ── InfoRow ───────────────────────────────────────────────────────────── */
function InfoRow({ label, value, icon, mono }: {
  label: string
  value: string
  icon?: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className="rounded-xl bg-[#fcf9f8] px-4 py-3">
      <p className="mb-0.5 text-xs font-medium text-[#717786]">{label}</p>
      <p className={`flex items-center gap-1.5 text-sm font-semibold text-[#1c1b1b] ${mono ? 'font-mono tracking-widest' : ''}`}>
        {icon}
        {value}
      </p>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────────────── */
export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [org, setOrg]             = useState<Organization | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    organizationsApi.getMe().then(setOrg).catch(() => null)
  }, [])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const stored = localStorage.getItem('auth-storage')
      const token = stored ? (JSON.parse(stored) as { state?: { token?: string } }).state?.token : null
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}/uploads/event-image`,
        {
          method: 'POST',
          body: form,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      )
      if (res.ok) {
        const data = await res.json() as { url: string }
        setAvatarUrl(data.url)
        toast.success('Photo de profil mise à jour')
      } else {
        toast.error('Erreur lors du téléchargement')
      }
    } catch {
      toast.error('Erreur lors du téléchargement')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSaved = (newEmail?: string) => {
    if (newEmail) updateUser({ email: newEmail })
    setShowModal(false)
  }

  if (!user) return null

  const roleConf = ROLE_CONFIG[user.role]
  const initials = `${user.first_name[0] ?? ''}${user.last_name[0] ?? ''}`.toUpperCase()
  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <div className="px-8 py-10">

        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1c1b1b]">Mon Profil</h1>
          <p className="mt-1 text-sm text-[#717786]">Gérez vos informations personnelles.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Colonne gauche — carte profil */}
          <div className="rounded-2xl border border-[#c1c6d7] bg-white p-6">
            <div className="flex flex-col items-center text-center">

              {/* Avatar */}
              <div className="relative mb-4">
                <div
                  className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full"
                  style={avatarUrl ? undefined : { background: 'var(--brand-gradient)' }}
                >
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-white">{initials}</span>
                  )}
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#005ab6] text-white shadow transition-opacity hover:opacity-90"
                >
                  {uploadingAvatar
                    ? <div className="h-3.5 w-3.5 animate-spin rounded-full border border-white border-t-transparent" />
                    : <Camera className="h-3.5 w-3.5" />
                  }
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>

              <h2 className="text-lg font-bold text-[#1c1b1b]">{user.first_name} {user.last_name}</h2>
              <p className="mt-0.5 text-sm text-[#717786]">{user.email}</p>

              <span className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${roleConf.className}`}>
                <Shield className="h-3 w-3" />
                {roleConf.label}
              </span>

              {joinDate && (
                <p className="mt-4 text-xs text-[#717786]">Membre depuis le {joinDate}</p>
              )}

              <Button
                onClick={() => setShowModal(true)}
                className="mt-5 w-full font-semibold text-white"
                style={{ background: 'var(--brand-gradient)', border: 'none' }}
              >
                Modifier le profil
              </Button>
            </div>
          </div>

          {/* Colonne droite — informations */}
          <div className="space-y-5 lg:col-span-2">

            {/* Informations personnelles */}
            <div className="rounded-2xl border border-[#c1c6d7] bg-white p-6">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#717786]">
                <User className="h-4 w-4" />
                Informations personnelles
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <InfoRow label="Prénom" value={user.first_name} />
                <InfoRow label="Nom" value={user.last_name} />
                <InfoRow label="Email" value={user.email} icon={<Mail className="h-4 w-4 text-[#717786]" />} />
                <InfoRow label="Rôle" value={roleConf.label} icon={<Shield className="h-4 w-4 text-[#717786]" />} />
              </div>
            </div>

            {/* Organisation */}
            <div className="rounded-2xl border border-[#c1c6d7] bg-white p-6">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#717786]">
                <Building2 className="h-4 w-4" />
                Organisation
              </h3>
              {org ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <InfoRow label="Nom" value={org.name} />
                  <InfoRow label="Type" value={org.type} />
                  {user.role !== 'member' && (
                    <InfoRow label="Code d'invitation" value={org.inviteCode} mono />
                  )}
                  <InfoRow
                    label="Créée le"
                    value={new Date(org.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 text-sm text-[#717786]">
                  <Building2 className="h-4 w-4 shrink-0" />
                  Chargement de l&apos;organisation…
                </div>
              )}
            </div>

            {/* Sécurité */}
            <div className="rounded-2xl border border-[#c1c6d7] bg-white p-6">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#717786]">
                <Lock className="h-4 w-4" />
                Sécurité
              </h3>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-[#1c1b1b]">Mot de passe</p>
                  <p className="text-xs text-[#717786]">••••••••••</p>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="text-sm font-medium text-[#005ab6] hover:underline"
                >
                  Modifier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <EditModal
          currentEmail={user.email}
          onClose={() => setShowModal(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  )
}
