'use client'

import { useEffect, useState } from 'react'
import { Copy, Check, RefreshCw, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { organizationsApi } from '@/lib/api/organizations.api'
import { useAuthStore } from '@/lib/store/auth.store'
import type { Organization } from '@/lib/types'

const ORG_TYPE_LABELS: Record<string, string> = {
  Entreprise: 'Entreprise',
  Association: 'Association',
  Autres: 'Autres',
}

export default function SettingsPage() {
  const { user } = useAuthStore()
  const [org, setOrg]             = useState<Organization | null>(null)
  const [loading, setLoading]     = useState(true)
  const [copied, setCopied]       = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [confirmRegen, setConfirmRegen] = useState(false)

  const isOwner = user?.role === 'owner'

  useEffect(() => {
    organizationsApi.getMe()
      .then(setOrg)
      .finally(() => setLoading(false))
  }, [])

  const handleCopy = async () => {
    if (!org?.inviteCode) return
    await navigator.clipboard.writeText(org.inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegenerate = async () => {
    if (!confirmRegen) {
      setConfirmRegen(true)
      setTimeout(() => setConfirmRegen(false), 4000)
      return
    }
    setRegenerating(true)
    try {
      const updated = await organizationsApi.regenerateInviteCode()
      setOrg(updated)
      setConfirmRegen(false)
    } finally {
      setRegenerating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcf9f8] px-8 py-10">
        <div className="space-y-4 max-w-2xl">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-48 animate-pulse rounded-2xl bg-gray-200" />
          <div className="h-40 animate-pulse rounded-2xl bg-gray-200" />
        </div>
      </div>
    )
  }

  if (!org) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcf9f8]">
        <p className="text-sm text-[#717786]">Organisation introuvable.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <div className="px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1c1b1b]">Paramètres</h1>
          <p className="mt-1 text-sm text-[#717786]">
            Informations et configuration de votre organisation.
          </p>
        </div>

        <div className="max-w-2xl space-y-6">

          {/* Infos organisation */}
          <section className="rounded-2xl border border-[#c1c6d7] bg-white p-6">
            <div className="mb-4 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: 'var(--brand-gradient)' }}
              >
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-base font-semibold text-[#1c1b1b]">Organisation</h2>
            </div>

            <dl className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-[#c1c6d7]">
                <dt className="text-sm text-[#717786]">Nom</dt>
                <dd className="text-sm font-medium text-[#1c1b1b]">{org.name}</dd>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-[#c1c6d7]">
                <dt className="text-sm text-[#717786]">Type</dt>
                <dd className="text-sm font-medium text-[#1c1b1b]">
                  {ORG_TYPE_LABELS[org.type] ?? org.type}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-sm text-[#717786]">Créée le</dt>
                <dd className="text-sm font-medium text-[#1c1b1b]">
                  {new Date(org.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </dd>
              </div>
            </dl>
          </section>

          {/* Code d'invitation */}
          <section className="rounded-2xl border border-[#c1c6d7] bg-white p-6">
            <h2 className="mb-1 text-base font-semibold text-[#1c1b1b]">Code d&apos;invitation</h2>
            <p className="mb-4 text-sm text-[#717786]">
              Partagez ce code avec les personnes que vous souhaitez inviter dans votre organisation.
            </p>

            <div className="flex items-center gap-3 rounded-xl border-2 border-dashed border-[#c1c6d7] bg-[#fcf9f8] px-5 py-4">
              <p className="flex-1 text-2xl font-bold tracking-[0.2em] text-[#005ab6]">
                {org.inviteCode}
              </p>
              <button
                onClick={handleCopy}
                title="Copier le code"
                className="rounded-lg p-2 text-[#717786] transition-colors hover:bg-blue-50 hover:text-[#005ab6]"
              >
                {copied ? <Check className="h-5 w-5 text-emerald-600" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>

            {copied && (
              <p className="mt-2 text-xs text-emerald-600">Code copié dans le presse-papier&nbsp;!</p>
            )}

            {isOwner && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRegenerate}
                  disabled={regenerating}
                  className={`gap-2 ${confirmRegen ? 'border-orange-400 text-orange-700 hover:bg-orange-50' : ''}`}
                >
                  <RefreshCw className={`h-4 w-4 ${regenerating ? 'animate-spin' : ''}`} />
                  {regenerating
                    ? 'Régénération…'
                    : confirmRegen
                      ? 'Cliquer pour confirmer (l\'ancien code sera invalidé)'
                      : 'Régénérer le code'}
                </Button>
              </div>
            )}
          </section>

          {/* Votre rôle */}
          <section className="rounded-2xl border border-[#c1c6d7] bg-white p-6">
            <h2 className="mb-3 text-base font-semibold text-[#1c1b1b]">Votre rôle</h2>
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: 'var(--brand-gradient)' }}
              >
                {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-[#1c1b1b]">
                  {user?.first_name} {user?.last_name}
                </p>
                <p className="text-xs capitalize text-[#717786]">
                  {user?.role === 'owner' ? 'Propriétaire' : user?.role === 'admin' ? 'Administrateur' : 'Membre'}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
