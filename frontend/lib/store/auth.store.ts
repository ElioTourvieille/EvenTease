'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { setAuthToken } from '@/lib/api/client'
import type { User } from '@/lib/types/user.types'

interface AuthState {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => {
        setAuthToken(user.token)
        set({ user })
      },
      clearUser: () => {
        setAuthToken(null)
        set({ user: null })
      },
    }),
    { name: 'auth-storage' }
  )
)
