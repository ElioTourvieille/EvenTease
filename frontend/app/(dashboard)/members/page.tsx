'use client'

import { useEffect, useState } from 'react'
import { UserX, Shield, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usersApi } from '@/lib/api/users.api'
import { useAuthStore } from '@/lib/store/auth.store'
import type { User as UserType, UserRole } from '@/lib/types'

const ROLE_LABELS: Record<UserRole, string> = {
  owner: 'Propriétaire',
  admin: 'Administrateur',
  member: 'Membre',
}

const ROLE_BADGE: Record<UserRole, string> = {
  owner: 'bg-purple-100 text-purple-700',
  admin: 'bg-blue-100 text-[#005ab6]',
  member: 'bg-gray-100 text-[#414754]',
}

/* ── Modal confirmation retrait ──────────────────────────────────────── */
function RemoveModal({
  member,
  onConfirm,
  onClose,
}: {
  member: UserType
  onConfirm: () => Promise<void>
  onClose: () => void
}) {
  const [loading, setLoading] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-[#1c1b1b]">Retirer le membre&nbsp;?</h3>
        <p className="mt-2 text-sm text-[#717786]">
          <span className="font-medium text-[#1c1b1b]">
            {member.first_name} {member.last_name}
          </span>{' '}
          sera retiré de l&apos;organisation. Cette action est irréversible.
        </p>
        <div className="mt-5 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={loading}>
            Annuler
          </Button>
          <Button
            onClick={async () => { setLoading(true); await onConfirm(); setLoading(false) }}
            disabled={loading}
            className="flex-1 font-semibold text-white"
            style={{ background: '#ba1a1a', border: 'none' }}
          >
            {loading ? 'Retrait…' : 'Confirmer'}
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────────────── */
export default function MembersPage() {
  const { user: currentUser } = useAuthStore()
  const [members, setMembers]       = useState<UserType[]>([])
  const [loading, setLoading]       = useState(true)
  const [removeTarget, setRemoveTarget] = useState<UserType | null>(null)
  const [roleLoading, setRoleLoading]   = useState<string | null>(null)

  const isOwner = currentUser?.role === 'owner'

  useEffect(() => {
    usersApi.getAll()
      .then(setMembers)
      .finally(() => setLoading(false))
  }, [])

  const handleRoleToggle = async (member: UserType) => {
    if (!isOwner || member.role === 'owner') return
    const newRole: Exclude<UserRole, 'owner'> = member.role === 'admin' ? 'member' : 'admin'
    setRoleLoading(member._id)
    try {
      const updated = await usersApi.updateRole(member._id, newRole)
      setMembers((prev) => prev.map((m) => (m._id === updated._id ? { ...m, role: updated.role } : m)))
    } finally {
      setRoleLoading(null)
    }
  }

  const handleRemove = async () => {
    if (!removeTarget) return
    await usersApi.remove(removeTarget._id)
    setMembers((prev) => prev.filter((m) => m._id !== removeTarget._id))
    setRemoveTarget(null)
  }

  const formattedDate = (date: Date | string) =>
    new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })

  if (!currentUser) return null

  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <div className="px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1c1b1b]">Membres</h1>
          <p className="mt-1 text-sm text-[#717786]">
            Gérez les membres de votre organisation.
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#c1c6d7] bg-white">
            {/* En-tête tableau */}
            <div className="grid grid-cols-12 gap-4 border-b border-[#c1c6d7] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#717786]">
              <span className="col-span-4">Membre</span>
              <span className="col-span-3">Email</span>
              <span className="col-span-2">Rôle</span>
              <span className="col-span-2">Membre depuis</span>
              <span className="col-span-1" />
            </div>

            {members.length === 0 ? (
              <div className="py-16 text-center text-sm text-[#717786]">Aucun membre trouvé.</div>
            ) : (
              members.map((member) => {
                const isSelf = member._id === currentUser._id
                const canRemove = !isSelf && member.role !== 'owner'
                const canToggleRole = isOwner && member.role !== 'owner' && !isSelf

                return (
                  <div
                    key={member._id}
                    className="grid grid-cols-12 items-center gap-4 border-b border-[#c1c6d7] px-5 py-4 last:border-0"
                  >
                    {/* Nom */}
                    <div className="col-span-4 flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ background: 'var(--brand-gradient)' }}
                      >
                        {member.first_name.charAt(0)}{member.last_name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[#1c1b1b]">
                          {member.first_name} {member.last_name}
                          {isSelf && <span className="ml-1.5 text-xs text-[#717786]">(vous)</span>}
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="col-span-3 min-w-0">
                      <p className="truncate text-sm text-[#414754]">{member.email}</p>
                    </div>

                    {/* Rôle */}
                    <div className="col-span-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_BADGE[member.role]}`}>
                        {ROLE_LABELS[member.role]}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="col-span-2">
                      <p className="text-sm text-[#717786]">
                        {member.createdAt ? formattedDate(member.createdAt) : '—'}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex justify-end gap-1.5">
                      {canToggleRole && (
                        <button
                          title={member.role === 'admin' ? 'Rétrograder en membre' : 'Promouvoir en admin'}
                          onClick={() => handleRoleToggle(member)}
                          disabled={roleLoading === member._id}
                          className="rounded-lg p-1.5 text-[#717786] transition-colors hover:bg-blue-50 hover:text-[#005ab6]"
                        >
                          {member.role === 'admin' ? <User className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                        </button>
                      )}
                      {canRemove && (
                        <button
                          title="Retirer de l'organisation"
                          onClick={() => setRemoveTarget(member)}
                          className="rounded-lg p-1.5 text-[#717786] transition-colors hover:bg-red-50 hover:text-[#ba1a1a]"
                        >
                          <UserX className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

      {removeTarget && (
        <RemoveModal
          member={removeTarget}
          onConfirm={handleRemove}
          onClose={() => setRemoveTarget(null)}
        />
      )}
    </div>
  )
}
