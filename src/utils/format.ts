export function formatCurrency(amount: number, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

function parseDateInput(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return null
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null
  return date
}

export function toDateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function todayDateInputValue() {
  return toDateInputValue(new Date())
}

export function addDaysToDateInput(dateISO: string, days: number) {
  const date = parseDateInput(dateISO)
  if (!date) return dateISO
  date.setDate(date.getDate() + days)
  return toDateInputValue(date)
}

export function formatCompactDate(dateISO: string) {
  if (!dateISO) return ''
  const date = parseDateInput(dateISO)
  if (!date) return ''
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: '2-digit',
  }).format(date)
}

export function nightsBetween(checkIn: string, checkOut: string) {
  const a = parseDateInput(checkIn)
  const b = parseDateInput(checkOut)
  if (!a || !b) return 0
  const ms = b.getTime() - a.getTime()
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)))
}

export function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
