import apiClient from './client'
import type { User, UserRole } from '@/lib/types'

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const res = await apiClient.get<User[]>('/users')
    return res.data
  },

  getMe: async (): Promise<User> => {
    const res = await apiClient.get<User>('/users/me')
    return res.data
  },

  updateMe: async (data: { email?: string; password?: string }): Promise<User> => {
    const res = await apiClient.put<User>('/users/me', data)
    return res.data
  },

  updateRole: async (id: string, role: Exclude<UserRole, 'owner'>): Promise<User> => {
    const res = await apiClient.put<User>(`/users/${id}/role`, { role })
    return res.data
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`)
  },
}
