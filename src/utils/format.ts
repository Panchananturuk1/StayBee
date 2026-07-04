export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatCompactDate(dateISO: string) {
  if (!dateISO) return ''
  const d = new Date(dateISO)
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: '2-digit',
  }).format(d)
}

export function nightsBetween(checkIn: string, checkOut: string) {
  const a = new Date(checkIn)
  const b = new Date(checkOut)
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0
  const ms = b.getTime() - a.getTime()
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)))
}

export function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
