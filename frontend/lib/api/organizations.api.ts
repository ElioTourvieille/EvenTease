import apiClient from './client'
import type { Organization } from '@/lib/types'

export const organizationsApi = {
  getMe: async (): Promise<Organization> => {
    const res = await apiClient.get<Organization>('/organizations/me')
    return res.data
  },

  regenerateInviteCode: async (): Promise<Organization> => {
    const res = await apiClient.patch<Organization>('/organizations/invite-code')
    return res.data
  },
}
