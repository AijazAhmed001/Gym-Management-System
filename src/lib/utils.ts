import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function formatDate(date: string | Date, fmt = 'MMM d, yyyy') {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, fmt)
}

export function formatRelative(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

export function getDayName(dayOfWeek: number) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[dayOfWeek]
}

export function getDayShort(dayOfWeek: number) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[dayOfWeek]
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getPlanColor(plan: string) {
  switch (plan.toLowerCase()) {
    case 'elite': return 'var(--accent)'
    case 'pro': return 'var(--primary)'
    default: return 'var(--success)'
  }
}

export function getStatusColor(status: string) {
  switch (status.toUpperCase()) {
    case 'ACTIVE': case 'succeeded': case 'ATTENDED': return 'var(--success)'
    case 'CANCELLED': case 'failed': case 'EXPIRED': return '#ff4d4d'
    case 'PENDING': case 'BOOKED': return 'var(--primary)'
    default: return 'var(--text-muted)'
  }
}

export function parseFeatures(features: string): string[] {
  try {
    return JSON.parse(features)
  } catch {
    return []
  }
}

export function parseArray(value: string): string[] {
  try {
    return JSON.parse(value)
  } catch {
    return []
  }
}
