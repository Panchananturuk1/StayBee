import { useEffect, useState } from 'react'
import { Calendar, MapPin, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Chip from '@/components/ui/Chip'
import { cn } from '@/lib/utils'
import { fetchHotels } from '@/services/hotels'
import { useSearchStore } from '@/store/useSearchStore'
import {
  addDaysToDateInput,
  formatCompactDate,
  nightsBetween,
  todayDateInputValue,
} from '@/utils/format'
import { nextWeekRange, tonightRange, upcomingWeekendRange } from '@/utils/datePresets'

type Panel = 'location' | 'dates' | 'summary' | null

let locationsPromise: Promise<string[]> | null = null

/**
 * Stored locations are full postal addresses. The search API matches each
 * comma-separated part as a substring, so a trimmed town label still resolves.
 */
function destinationLabel(location: string) {
  const parenthetical = location.match(/\(([^)]+)\)\s*$/)
  if (parenthetical) return parenthetical[1].split(',')[0].trim()

  const parts = location
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  return parts.slice(0, 2).join(', ')
}

function loadLocationSuggestions() {
  locationsPromise ??= fetchHotels()
    .then((hotels) =>
      [...new Set(hotels.map((hotel) => destinationLabel(hotel.location)).filter(Boolean))].sort(),
    )
    .catch(() => {
      locationsPromise = null
      return []
    })

  return locationsPromise
}

export default function SearchBar() {
  const navigate = useNavigate()
  const location = useSearchStore((s) => s.location)
  const checkIn = useSearchStore((s) => s.checkIn)
  const checkOut = useSearchStore((s) => s.checkOut)
  const guests = useSearchStore((s) => s.guests)
  const setBasics = useSearchStore((s) => s.setBasics)

  const [panel, setPanel] = useState<Panel>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    if (panel !== 'location') return
    let cancelled = false
    void loadLocationSuggestions().then((list) => {
      if (!cancelled) setSuggestions(list)
    })
    return () => {
      cancelled = true
    }
  }, [panel])

  const today = todayDateInputValue()
  const nights = nightsBetween(checkIn, checkOut)

  const datePresets = [
    { label: 'Tonight', range: tonightRange() },
    { label: 'This weekend', range: upcomingWeekendRange() },
    { label: 'Next week', range: nextWeekRange() },
  ]

  const togglePanel = (next: Exclude<Panel, null>) =>
    setPanel((current) => (current === next ? null : next))

  const chips: { id: Exclude<Panel, null>; label: string; icon: typeof MapPin }[] = [
    { id: 'location', label: 'Smart location hints', icon: MapPin },
    { id: 'dates', label: 'Flexible dates', icon: Calendar },
    { id: 'summary', label: 'Instant booking summary', icon: Users },
  ]

  return (
    <Card className="p-4 md:p-5">
      <div className="grid gap-3 md:grid-cols-12 md:items-end">
        <div className="md:col-span-4">
          <Input
            label="Where"
            placeholder="City, neighborhood, or hotel"
            value={location}
            onChange={(e) => setBasics({ location: e.target.value })}
          />
        </div>
        <div className="md:col-span-3">
          <Input
            label="Check in"
            type="date"
            min={today}
            value={checkIn}
            onChange={(e) => {
              const nextCheckIn = e.target.value
              const updates: { checkIn: string; checkOut?: string } = { checkIn: nextCheckIn }
              if (checkOut && nextCheckIn && checkOut <= nextCheckIn) {
                updates.checkOut = addDaysToDateInput(nextCheckIn, 1)
              }
              setBasics(updates)
            }}
          />
        </div>
        <div className="md:col-span-3">
          <Input
            label="Check out"
            type="date"
            min={checkIn || today}
            value={checkOut}
            onChange={(e) => setBasics({ checkOut: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <Input
            label="Guests"
            type="number"
            min={1}
            max={6}
            value={guests}
            onChange={(e) => setBasics({ guests: Number(e.target.value || 1) })}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {chips.map(({ id, label, icon: Icon }) => {
            const isOpen = panel === id
            return (
              <button
                key={id}
                type="button"
                aria-expanded={isOpen}
                onClick={() => togglePanel(id)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full px-3 py-2 ring-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey/50',
                  isOpen
                    ? 'bg-honey/18 text-honey ring-honey/25'
                    : 'bg-white/4 text-white/60 ring-white/10 hover:bg-white/8 hover:text-white',
                )}
              >
                <Icon className={cn('h-4 w-4', isOpen ? 'text-honey' : 'text-white/55')} />
                {label}
              </button>
            )
          })}
        </div>
        <Button onClick={() => navigate('/search')} className="h-12 px-7">
          Search stays
        </Button>
      </div>

      {panel === 'location' ? (
        <div className="mt-4 rounded-2xl bg-white/4 p-4 ring-1 ring-white/10">
          <div className="text-xs font-medium tracking-wide text-white/55">Popular destinations</div>
          {suggestions.length === 0 ? (
            <div className="mt-3 text-xs text-white/45">Loading destinations…</div>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.slice(0, 10).map((suggestion) => (
                <Chip
                  key={suggestion}
                  selected={location === suggestion}
                  onClick={() => {
                    setBasics({ location: suggestion })
                    setPanel(null)
                  }}
                >
                  {suggestion}
                </Chip>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {panel === 'dates' ? (
        <div className="mt-4 rounded-2xl bg-white/4 p-4 ring-1 ring-white/10">
          <div className="text-xs font-medium tracking-wide text-white/55">Quick date presets</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {datePresets.map(({ label, range }) => (
              <Chip
                key={label}
                selected={checkIn === range.checkIn && checkOut === range.checkOut}
                onClick={() => {
                  setBasics(range)
                  setPanel(null)
                }}
              >
                {label} · {formatCompactDate(range.checkIn)} – {formatCompactDate(range.checkOut)}
              </Chip>
            ))}
            {checkIn || checkOut ? (
              <Chip onClick={() => setBasics({ checkIn: '', checkOut: '' })}>Clear dates</Chip>
            ) : null}
          </div>
        </div>
      ) : null}

      {panel === 'summary' ? (
        <div className="mt-4 grid gap-3 rounded-2xl bg-white/4 p-4 ring-1 ring-white/10 sm:grid-cols-4">
          <div>
            <div className="text-xs text-white/45">Where</div>
            <div className="mt-1 truncate text-sm text-white/85">{location || 'Anywhere'}</div>
          </div>
          <div>
            <div className="text-xs text-white/45">Dates</div>
            <div className="mt-1 text-sm text-white/85">
              {checkIn && checkOut
                ? `${formatCompactDate(checkIn)} → ${formatCompactDate(checkOut)}`
                : 'Not selected'}
            </div>
          </div>
          <div>
            <div className="text-xs text-white/45">Nights</div>
            <div className="mt-1 text-sm text-white/85">{nights || '—'}</div>
          </div>
          <div>
            <div className="text-xs text-white/45">Guests</div>
            <div className="mt-1 text-sm text-white/85">{guests}</div>
          </div>
        </div>
      ) : null}
    </Card>
  )
}
