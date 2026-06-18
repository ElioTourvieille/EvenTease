import type { UserRole } from '@/lib/types'

export const canValidateEvent = (role: UserRole): boolean =>
  role !== 'member'

export const canManageMembers = (role: UserRole): boolean =>
  role !== 'member'

export const canInviteAdmin = (role: UserRole): boolean =>
  role === 'owner'

export const canDeleteEvent = (
  role: UserRole,
  userId: string,
  createdBy: string,
): boolean => role !== 'member' || userId === createdBy

export const canEditEvent = (
  role: UserRole,
  userId: string,
  createdBy: string,
): boolean => role !== 'member' || userId === createdBy

export const canViewSettings = (role: UserRole): boolean =>
  role !== 'member'
