import { cn } from '@/lib/utils'
import type { CalendarDay } from '@/types/stay'
import { formatCurrency } from '@/utils/format'

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function statusClasses(status: CalendarDay['status']) {
  if (status === 'soldout') return 'bg-red-400/10 text-red-100 ring-red-300/20'
  if (status === 'limited') return 'bg-honey/10 text-white ring-honey/20'
  return 'bg-white/5 text-white/80 ring-white/10'
}

export default function AvailabilityCalendar({
  days,
  month,
  isLoading,
}: {
  days: CalendarDay[]
  month: string
  isLoading?: boolean
}) {
  if (!month) return null

  const [year, monthNumber] = month.split('-').map(Number)
  const firstDay = new Date(year, monthNumber - 1, 1).getDay()
  const monthLabel = new Date(year, monthNumber - 1, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })

  const dayMap = new Map(days.map((day) => [day.date, day]))
  const cells: Array<CalendarDay | null> = Array.from({ length: firstDay }, () => null)

  for (let day = 1; day <= days.length; day += 1) {
    const dateISO = `${year}-${String(monthNumber).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    cells.push(dayMap.get(dateISO) || null)
  }

  return (
    <div className="rounded-3xl bg-white/4 p-4 ring-1 ring-white/10">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs font-medium tracking-wide text-white/55">Availability calendar</div>
          <div className="mt-1 font-display text-xl tracking-tight text-white">{monthLabel}</div>
        </div>
        <div className="text-xs text-white/50">{isLoading ? 'Updating…' : 'Weekend rates apply Fri–Sat'}</div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-[11px] font-medium tracking-wide text-white/45">
        {weekdayLabels.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {cells.map((day, index) =>
          day ? (
            <div
              key={day.date}
              className={cn(
                'rounded-2xl px-2 py-2 text-center ring-1',
                statusClasses(day.status),
              )}
            >
              <div className="text-xs font-medium">{Number(day.date.slice(-2))}</div>
              <div className="mt-1 text-[10px] text-white/70">{formatCurrency(day.price)}</div>
              <div className="mt-1 text-[10px] uppercase tracking-wide text-white/45">
                {day.status === 'soldout' ? 'Sold out' : `${day.availableUnits} left`}
              </div>
            </div>
          ) : (
            <div key={`empty-${index}`} />
          ),
        )}
      </div>
    </div>
  )
}
