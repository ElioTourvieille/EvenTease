'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalendarDays, Mail, Lock } from 'lucide-react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/lib/store/auth.store'
import apiClient from '@/lib/api/client'
import type { User, UserRole } from '@/lib/types'

/* ── Zod ──────────────────────────────────────────────────────────────── */
const schema = z.object({
  email:    z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
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
export default function LoginPage() {
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
      const res = await apiClient.post<AuthApiResponse>('/auth/login', data)
      const { access_token, user: apiUser } = res.data
      const user: User = { ...apiUser, token: access_token }
      login(user, access_token)
      router.replace('/main')
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setServerError('Email ou mot de passe incorrect')
      } else {
        setServerError('Une erreur est survenue. Veuillez réessayer.')
      }
    }
  }

  return (
    <div className="flex h-screen">

      {/* ── Panel gauche ─────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex w-[45%] flex-col justify-between p-12 text-white"
        style={{ background: 'var(--brand-gradient)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <CalendarDays className="h-6 w-6" />
          </div>
          <span className="text-2xl font-bold">EvenTease</span>
        </div>

        {/* Tagline */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold leading-tight">
              Créez des expériences<br />mémorables, sans effort.
            </h1>
            <p className="mt-4 leading-relaxed text-white/80">
              La plateforme SaaS nouvelle génération pour la gestion
              d&apos;événements d&apos;entreprise. Organisez, gérez et analysez
              vos événements avec une précision inégalée.
            </p>
          </div>

          <div className="h-px bg-white/20" />

          <div className="flex gap-12">
            <div>
              <p className="text-3xl font-bold">500+</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/70">
                Clients actifs
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold">12k+</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/70">
                Events réalisés
              </p>
            </div>
          </div>
        </div>

        <div />
      </div>

      {/* ── Panel droit ──────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-white p-8 lg:p-16">
        <div className="w-full max-w-[420px] space-y-8">

          {/* Onglets Connexion / Inscription */}
          <div className="flex rounded-full border border-[#c1c6d7] p-1">
            <span className="flex-1 rounded-full py-2 text-center text-sm font-semibold text-white"
                  style={{ background: 'var(--brand-gradient)' }}>
              Connexion
            </span>
            <Link
              href="/register"
              className="flex-1 py-2 text-center text-sm font-medium text-[#414754] transition-colors hover:text-[#005ab6]"
            >
              Inscription
            </Link>
          </div>

          {/* Titre */}
          <div>
            <h2 className="text-2xl font-bold text-[#1c1b1b]">Bon retour&nbsp;!</h2>
            <p className="mt-1 text-sm text-[#717786]">
              Veuillez entrer vos identifiants pour accéder à votre espace.
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-[#1c1b1b]">
                Email Professionnel
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717786]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nom@entreprise.fr"
                  className="pl-10"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-[#ba1a1a]">{errors.email.message}</p>
              )}
            </div>

            {/* Mot de passe */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-[#1c1b1b]">
                  Mot de passe
                </label>
                <button type="button" className="text-xs font-medium text-[#005ab6] hover:underline">
                  Oublié&nbsp;?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717786]" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  {...register('password')}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-[#ba1a1a]">{errors.password.message}</p>
              )}
            </div>

            {/* Erreur serveur */}
            {serverError && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-[#ba1a1a]">
                {serverError}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-semibold text-white"
              style={{ background: 'var(--brand-gradient)', border: 'none' }}
            >
              {isSubmitting ? 'Connexion…' : 'Se connecter'}
            </Button>
          </form>

          <p className="text-center text-sm text-[#717786]">
            Pas encore de compte&nbsp;?{' '}
            <Link href="/register" className="font-medium text-[#005ab6] hover:underline">
              S&apos;inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
