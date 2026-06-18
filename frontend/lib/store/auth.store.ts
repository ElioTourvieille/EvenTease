'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { setAuthToken } from '@/lib/api/client'
import type { User } from '@/lib/types'

interface AuthState {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => {
        setAuthToken(token)
        set({ user, token })
      },
      logout: () => {
        setAuthToken(null)
        set({ user: null, token: null })
      },
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state?.token) setAuthToken(state.token)
      },
    },
  ),
)
