import type { EventStatus } from '@/lib/types'

const config: Record<EventStatus, { label: string; className: string }> = {
  published: {
    label: 'À venir',
    className: 'bg-emerald-100 text-emerald-700',
  },
  pending: {
    label: 'En attente de validation',
    className: 'bg-orange-100 text-orange-700',
  },
  cancelled: {
    label: 'Annulé',
    className: 'bg-red-100 text-[#ba1a1a]',
  },
}

interface Props {
  status: EventStatus
}

export default function EventStatusBadge({ status }: Props) {
  const { label, className } = config[status]
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}
