export type EventStatus = 'pending' | 'published' | 'cancelled'
export type EventType = 'Team Building' | 'Conférence' | 'Apéritif' | 'Autres'
export type EventAccess = 'Ouvert à tous' | 'Equipe de direction' | 'Service concerné'

export interface Event {
  _id: string
  title: string
  type: EventType
  invitation: EventAccess
  date: string
  time: string
  address: string
  description: string
  image?: string
  organizationId: string
  createdBy: string
  participants: string[]
  status: EventStatus
  cancelReason?: string
  createdAt: Date
}

export type CreateEventDto = Omit<Event,
  '_id' | 'participants' | 'status' | 'createdAt' | 'createdBy' | 'organizationId'
>
