export type UserRole = 'owner' | 'admin' | 'member'

export interface User {
  _id: string
  first_name: string
  last_name: string
  email: string
  organizationId: string
  role: UserRole
  token: string
}
