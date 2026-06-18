'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/auth.store'
import SideBar from '@/components/layout/SideBar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false)
  const { user } = useAuthStore()
  const router = useRouter()

  useEffect(() => { setHydrated(true) }, [])

  useEffect(() => {
    if (hydrated && !user) router.replace('/login')
  }, [hydrated, user, router])

  if (!hydrated || !user) return null

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f5]">
      <SideBar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
