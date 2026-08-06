import { cn } from '@/lib/utils'
import { AVAILABILITY_PREVIEW_DAYS } from '@/constants/availability'
import type { CalendarDay } from '@/types/stay'
import { addDaysToDateInput, formatCompactDate, todayDateInputValue } from '@/utils/format'
import { formatCurrency } from '@/utils/format'

function statusClasses(status: CalendarDay['status']) {
  if (status === 'soldout') return 'bg-red-400/10 text-red-100 ring-red-300/20'
  if (status === 'limited') return 'bg-honey/10 text-white ring-honey/20'
  return 'bg-white/5 text-white/80 ring-white/10'
}

function previewDatesFromToday(count = AVAILABILITY_PREVIEW_DAYS) {
  const today = todayDateInputValue()
  return Array.from({ length: count }, (_, index) => addDaysToDateInput(today, index))
}

export default function AvailabilityCalendar({
  days,
  isLoading,
}: {
  days: CalendarDay[]
  month?: string
  isLoading?: boolean
}) {
  const dayMap = new Map(days.map((day) => [day.date, day]))
  const previewDays = previewDatesFromToday()
    .map((date) => dayMap.get(date))
    .filter((day): day is CalendarDay => Boolean(day))

  if (previewDays.length === 0 && !isLoading) return null

  return (
    <div className="rounded-3xl bg-white/4 p-4 ring-1 ring-white/10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-medium tracking-wide text-white/55">Availability</div>
          <div className="mt-1 font-display text-xl tracking-tight text-white">Next {AVAILABILITY_PREVIEW_DAYS} days</div>
        </div>
        <div className="text-xs text-white/50">{isLoading ? 'Updating…' : 'Weekend rates apply Fri–Sat'}</div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
        {previewDays.map((day) => (
          <div
            key={day.date}
            className={cn('rounded-2xl px-2 py-3 text-center ring-1', statusClasses(day.status))}
          >
            <div className="text-[11px] font-medium uppercase tracking-wide text-white/55">
              {formatCompactDate(day.date)}
            </div>
            <div className="mt-2 text-lg font-medium text-white">{Number(day.date.slice(-2))}</div>
            <div className="mt-1 text-xs text-white/75">{formatCurrency(day.price)}</div>
            <div className="mt-1 text-[10px] uppercase tracking-wide text-white/45">
              {day.status === 'soldout' ? 'Sold out' : `${day.availableUnits} left`}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
