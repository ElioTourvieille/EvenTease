'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalendarDays, Mail, Lock, User, Building2, Copy, Check } from 'lucide-react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/lib/store/auth.store'
import apiClient from '@/lib/api/client'
import type { User as UserType, UserRole } from '@/lib/types'

/* ── Zod ──────────────────────────────────────────────────────────────── */
const schema = z.object({
  first_name: z.string().min(2, 'Au moins 2 caractères'),
  last_name:  z.string().min(2, 'Au moins 2 caractères'),
  email:      z.string().email('Email invalide'),
  password:   z.string().min(8, 'Au moins 8 caractères'),
  orgName:    z.string().min(2, 'Au moins 2 caractères'),
  orgType:    z.enum(['Entreprise', 'Association', 'Autres'], {
    errorMap: () => ({ message: 'Sélectionnez un type' }),
  }),
})

type FormData = z.infer<typeof schema>

interface AuthApiResponse {
  access_token:  string
  refresh_token: string
  user: {
    _id:            string
    first_name:     string
    last_name:      string
    email:          string
    organizationId: string
    role:           UserRole
  }
}

interface OrgResponse {
  inviteCode: string
}

/* ── Page ─────────────────────────────────────────────────────────────── */
export default function RegisterCreatePage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [inviteCode,  setInviteCode]  = useState<string | null>(null)
  const [copied,      setCopied]      = useState(false)
  const { login } = useAuthStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  /* Redirect automatique après affichage du code */
  useEffect(() => {
    if (!inviteCode) return
    const timer = setTimeout(() => router.replace('/dashboard'), 3000)
    return () => clearTimeout(timer)
  }, [inviteCode, router])

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    try {
      const res = await apiClient.post<AuthApiResponse>('/auth/register/owner', data)
      const { access_token, user: apiUser } = res.data
      const user: UserType = { ...apiUser, token: access_token }
      login(user, access_token)

      /* Récupère l'inviteCode depuis l'organisation */
      const orgRes = await apiClient.get<OrgResponse>(`/organizations/${apiUser.organizationId}`)
      setInviteCode(orgRes.data.inviteCode)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setServerError('Cet email est déjà utilisé.')
      } else {
        setServerError('Une erreur est survenue. Veuillez réessayer.')
      }
    }
  }

  const handleCopy = async () => {
    if (!inviteCode) return
    await navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* ── Écran succès ────────────────────────────────────────────────── */
  if (inviteCode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcf9f8] p-6">
        <div className="w-full max-w-md space-y-6 text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: 'var(--brand-gradient)' }}
          >
            <Check className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1c1b1b]">Espace créé&nbsp;!</h2>
            <p className="mt-2 text-sm text-[#717786]">
              Partagez ce code avec vos collaborateurs pour qu&apos;ils rejoignent votre espace.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-dashed border-[#c1c6d7] bg-white p-6">
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[#717786]">
              Code d&apos;invitation
            </p>
            <p className="text-3xl font-bold tracking-widest text-[#005ab6]">{inviteCode}</p>
            <Button
              onClick={handleCopy}
              className="mt-4 w-full font-semibold text-white"
              style={{ background: 'var(--brand-gradient)', border: 'none' }}
            >
              {copied ? (
                <><Check className="mr-2 h-4 w-4" /> Copié&nbsp;!</>
              ) : (
                <><Copy className="mr-2 h-4 w-4" /> Copier le code</>
              )}
            </Button>
          </div>

          <p className="text-sm text-[#717786]">
            Redirection vers le dashboard dans quelques secondes…
          </p>
        </div>
      </div>
    )
  }

  /* ── Formulaire ──────────────────────────────────────────────────── */
  return (
    <div className="flex h-screen">

      {/* Panel gauche */}
      <div
        className="hidden lg:flex w-[45%] flex-col justify-between p-12 text-white"
        style={{ background: 'var(--brand-gradient)' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <CalendarDays className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold">EvenTease</span>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold leading-tight">
              Donnez vie à<br />votre organisation.
            </h1>
            <p className="mt-4 leading-relaxed text-white/80">
              Créez votre espace en quelques clics, invitez vos équipes
              et commencez à organiser des événements mémorables.
            </p>
          </div>
          <div className="h-px bg-white/20" />
          <div className="flex gap-12">
            <div>
              <p className="text-3xl font-bold">500+</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/70">Clients actifs</p>
            </div>
            <div>
              <p className="text-3xl font-bold">12k+</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/70">Events réalisés</p>
            </div>
          </div>
        </div>
        <div />
      </div>

      {/* Panel droit */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto bg-white p-8 lg:p-16">
        <div className="w-full max-w-[460px] space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[#1c1b1b]">Créer mon espace</h2>
            <p className="mt-1 text-sm text-[#717786]">
              Vous serez l&apos;administrateur principal de votre organisation.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

            {/* Prénom + Nom */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="first_name" className="text-sm font-medium text-[#1c1b1b]">Prénom</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717786]" />
                  <Input id="first_name" placeholder="Marc" className="pl-10" {...register('first_name')} />
                </div>
                {errors.first_name && (
                  <p className="text-xs text-[#ba1a1a]">{errors.first_name.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="last_name" className="text-sm font-medium text-[#1c1b1b]">Nom</label>
                <Input id="last_name" placeholder="Dupont" {...register('last_name')} />
                {errors.last_name && (
                  <p className="text-xs text-[#ba1a1a]">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-[#1c1b1b]">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717786]" />
                <Input id="email" type="email" placeholder="nom@entreprise.fr" className="pl-10" {...register('email')} />
              </div>
              {errors.email && <p className="text-xs text-[#ba1a1a]">{errors.email.message}</p>}
            </div>

            {/* Mot de passe */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-[#1c1b1b]">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717786]" />
                <Input id="password" type="password" placeholder="••••••••  (min. 8 caractères)" className="pl-10" {...register('password')} />
              </div>
              {errors.password && <p className="text-xs text-[#ba1a1a]">{errors.password.message}</p>}
            </div>

            {/* Nom entreprise */}
            <div className="space-y-1.5">
              <label htmlFor="orgName" className="text-sm font-medium text-[#1c1b1b]">
                Nom de l&apos;organisation
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717786]" />
                <Input id="orgName" placeholder="Origin Studio" className="pl-10" {...register('orgName')} />
              </div>
              {errors.orgName && <p className="text-xs text-[#ba1a1a]">{errors.orgName.message}</p>}
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <label htmlFor="orgType" className="text-sm font-medium text-[#1c1b1b]">
                Type d&apos;organisation
              </label>
              <select
                id="orgType"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                {...register('orgType')}
              >
                <option value="">Sélectionnez un type</option>
                <option value="Entreprise">Entreprise</option>
                <option value="Association">Association</option>
                <option value="Autres">Autres</option>
              </select>
              {errors.orgType && <p className="text-xs text-[#ba1a1a]">{errors.orgType.message}</p>}
            </div>

            {serverError && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-[#ba1a1a]">{serverError}</div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-semibold text-white"
              style={{ background: 'var(--brand-gradient)', border: 'none' }}
            >
              {isSubmitting ? 'Création…' : 'Créer mon espace'}
            </Button>
          </form>

          <p className="text-center text-sm text-[#717786]">
            Déjà un compte&nbsp;?{' '}
            <Link href="/login" className="font-medium text-[#005ab6] hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
