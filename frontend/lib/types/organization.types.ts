export type OrgType = 'Entreprise' | 'Association' | 'Autres'

export interface Organization {
  _id: string
  name: string
  type: OrgType
  ownerId: string
  inviteCode: string
  createdAt: Date
}
