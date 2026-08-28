import { cn } from '@/lib/utils'
import { AVAILABILITY_PREVIEW_DAYS } from '@/constants/availability'
import type { CalendarDay } from '@/types/stay'
import { formatCurrency } from '@/utils/format'

function statusClasses(status: CalendarDay['status']) {
  if (status === 'soldout') return 'bg-red-400/10 text-red-100 ring-red-300/20'
  if (status === 'limited') return 'bg-honey/10 text-white ring-honey/20'
  return 'bg-white/5 text-white/80 ring-white/10'
}

function weekdayLabel(dateISO: string) {
  const [year, month, day] = dateISO.split('-').map(Number)
  if (!year || !month || !day) return ''
  return new Date(year, month - 1, day).toLocaleDateString(undefined, { weekday: 'short' })
}

function dayLabel(dateISO: string) {
  const [year, month, day] = dateISO.split('-').map(Number)
  if (!year || !month || !day) return ''
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export default function AvailabilityCalendar({
  days,
  isLoading,
}: {
  days: CalendarDay[]
  isLoading?: boolean
}) {
  const preview = days.slice(0, AVAILABILITY_PREVIEW_DAYS)

  return (
    <div className="rounded-3xl bg-white/4 p-4 ring-1 ring-white/10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-medium tracking-wide text-white/55">Availability</div>
          <div className="mt-1 font-display text-xl tracking-tight text-white">
            Next {AVAILABILITY_PREVIEW_DAYS} days
          </div>
        </div>
        <div className="text-xs text-white/50">
          {isLoading ? 'Updating…' : 'Weekend rates apply Fri–Sat'}
        </div>
      </div>

      {preview.length === 0 ? (
        <div className="mt-4 text-sm text-white/50">
          {isLoading ? 'Loading availability…' : 'No availability to show for these dates.'}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {preview.map((day) => (
            <div
              key={day.date}
              className={cn('rounded-2xl px-2 py-3 text-center ring-1', statusClasses(day.status))}
            >
              <div className="text-[10px] uppercase tracking-wide text-white/50">
                {weekdayLabel(day.date)}
              </div>
              <div className="mt-0.5 text-xs font-medium">{dayLabel(day.date)}</div>
              <div className="mt-1 text-[11px] text-white/70">{formatCurrency(day.price)}</div>
              <div className="mt-1 text-[10px] uppercase tracking-wide text-white/45">
                {day.status === 'soldout' ? 'Sold out' : `${day.availableUnits} left`}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
