import apiClient from './client'
import type { Event, CreateEventDto } from '@/lib/types'

export type UpdateEventDto = Partial<CreateEventDto> & {
  cancelReason?: string
}

export const eventsApi = {
  getAll: async (): Promise<Event[]> => {
    const res = await apiClient.get<Event[]>('/events')
    return res.data
  },

  getById: async (id: string): Promise<Event> => {
    const res = await apiClient.get<Event>(`/events/${id}`)
    return res.data
  },

  create: async (dto: CreateEventDto): Promise<Event> => {
    const res = await apiClient.post<Event>('/events', dto)
    return res.data
  },

  update: async (id: string, dto: UpdateEventDto): Promise<Event> => {
    const res = await apiClient.put<Event>(`/events/${id}`, dto)
    return res.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/events/${id}`)
  },

  validate: async (id: string): Promise<Event> => {
    const res = await apiClient.patch<Event>(`/events/${id}/validate`)
    return res.data
  },

  cancel: async (id: string, cancelReason: string): Promise<Event> => {
    const res = await apiClient.patch<Event>(`/events/${id}/cancel`, { reason: cancelReason })
    return res.data
  },

  participate: async (id: string): Promise<Event> => {
    const res = await apiClient.put<Event>(`/events/${id}/participate`)
    return res.data
  },

  unsubscribe: async (id: string): Promise<void> => {
    await apiClient.delete(`/events/${id}/unsubscribe`)
  },

  getMine: async (): Promise<Event[]> => {
    const res = await apiClient.get<Event[]>('/events/mine')
    return res.data
  },

  getPending: async (): Promise<Event[]> => {
    const res = await apiClient.get<Event[]>('/events/pending')
    return res.data
  },

  getStats: async (): Promise<{ eventCount: number; userCount: number; pendingCount: number; participationRate: number }> => {
    const res = await apiClient.get<{ eventCount: number; userCount: number; pendingCount: number; participationRate: number }>('/events/stats')
    return res.data
  },
}
