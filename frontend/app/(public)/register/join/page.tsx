'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalendarDays, Mail, Lock, User, Hash } from 'lucide-react'
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
  inviteCode: z.string().min(1, { message: "Le code d'invitation est requis" }),
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

/* ── Page ─────────────────────────────────────────────────────────────── */
export default function RegisterJoinPage() {
  const [serverError, setServerError] = useState<string | null>(null)
  const { login } = useAuthStore()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    try {
      const res = await apiClient.post<AuthApiResponse>('/auth/register/member', data)
      const { access_token, user: apiUser } = res.data
      const user: UserType = { ...apiUser, token: access_token }
      login(user, access_token)
      router.replace('/main')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status
        if (status === 404) {
          setServerError("Code d'invitation invalide ou introuvable.")
        } else if (status === 409) {
          setServerError('Cet email est déjà utilisé.')
        } else {
          setServerError('Une erreur est survenue. Veuillez réessayer.')
        }
      } else {
        setServerError('Une erreur est survenue. Veuillez réessayer.')
      }
    }
  }

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
              Rejoignez<br />votre équipe.
            </h1>
            <p className="mt-4 leading-relaxed text-white/80">
              Entrez le code d&apos;invitation reçu de votre administrateur
              pour accéder à l&apos;espace de votre organisation.
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
            <h2 className="text-2xl font-bold text-[#1c1b1b]">Rejoindre un espace</h2>
            <p className="mt-1 text-sm text-[#717786]">
              Créez votre compte avec le code fourni par votre administrateur.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

            {/* Prénom + Nom */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="first_name" className="text-sm font-medium text-[#1c1b1b]">Prénom</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717786]" />
                  <Input id="first_name" placeholder="Marie" className="pl-10" {...register('first_name')} />
                </div>
                {errors.first_name && (
                  <p className="text-xs text-[#ba1a1a]">{errors.first_name.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label htmlFor="last_name" className="text-sm font-medium text-[#1c1b1b]">Nom</label>
                <Input id="last_name" placeholder="Martin" {...register('last_name')} />
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

            {/* Code d'invitation */}
            <div className="space-y-1.5">
              <label htmlFor="inviteCode" className="text-sm font-medium text-[#1c1b1b]">
                Code d&apos;invitation
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717786]" />
                <Input
                  id="inviteCode"
                  placeholder="XXXX-XXXX"
                  className="pl-10 font-mono tracking-widest uppercase"
                  {...register('inviteCode')}
                />
              </div>
              {errors.inviteCode && <p className="text-xs text-[#ba1a1a]">{errors.inviteCode.message}</p>}
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
              {isSubmitting ? 'Inscription…' : "Rejoindre l'espace"}
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
