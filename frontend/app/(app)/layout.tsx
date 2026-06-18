'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth.store'
import NavBar from '@/components/layout/NavBar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false)
  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => { setHydrated(true) }, [])

  useEffect(() => {
    if (hydrated && !user) router.replace('/login')
  }, [hydrated, user, router])

  if (!hydrated || !user) return null

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f5f5]">
      <NavBar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
