import { useEffect, useState } from 'react'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import HotelCard from '@/components/HotelCard'
import FiltersPanel from '@/components/FiltersPanel'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import SearchBar from '@/components/SearchBar'
import { fetchHotels } from '@/services/hotels'
import { useSearchStore } from '@/store/useSearchStore'
import type { Hotel } from '@/types/stay'

export default function Search() {
  const [showFilters, setShowFilters] = useState(false)
  const [visible, setVisible] = useState(6)
  const [results, setResults] = useState<Hotel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const location = useSearchStore((s) => s.location)
  const checkIn = useSearchStore((s) => s.checkIn)
  const checkOut = useSearchStore((s) => s.checkOut)
  const guests = useSearchStore((s) => s.guests)
  const sort = useSearchStore((s) => s.sort)
  const filters = useSearchStore((s) => s.filters)
  const setSort = useSearchStore((s) => s.setSort)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    void fetchHotels({ location, checkIn, checkOut, guests, sort, filters })
      .then((hotels) => {
        if (cancelled) return
        setResults(hotels)
      })
      .catch(() => {
        if (cancelled) return
        setError('Unable to load search results right now.')
        setResults([])
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [checkIn, checkOut, filters, guests, location, sort])

  const shown = results.slice(0, visible)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-medium tracking-wide text-white/55">Search</div>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-white">
            {isLoading ? 'Searching stays…' : `${results.length} stays`} {location ? `near “${location}”` : 'picked for you'}
          </h1>
          <div className="mt-2 text-sm text-white/55">
            Results come from the database and respect your selected dates, guests, and availability.
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            className="md:hidden"
            onClick={() => setShowFilters((v) => !v)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>

          <label className="relative">
            <div className="mb-2 text-xs font-medium tracking-wide text-white/55 md:mb-1">Sort</div>
            <div className="relative">
              <select
                className="h-11 w-56 appearance-none rounded-2xl bg-white/5 px-4 pr-10 text-sm text-white ring-1 ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-honey/50"
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
              >
                <option value="best">Best value</option>
                <option value="priceLow">Price: low</option>
                <option value="priceHigh">Price: high</option>
                <option value="rating">Rating</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
            </div>
          </label>
        </div>
      </div>

      <SearchBar />

      <div className="grid gap-6 md:grid-cols-12">
        <div className="hidden md:col-span-4 md:block">
          <FiltersPanel />
        </div>

        <div className="md:col-span-8">
          {showFilters ? (
            <div className="mb-6 md:hidden">
              <FiltersPanel />
            </div>
          ) : null}

          {error ? (
            <Card className="p-8">
              <div className="font-display text-2xl tracking-tight text-white">{error}</div>
            </Card>
          ) : null}

          {!error && !isLoading && results.length === 0 ? (
            <Card className="p-8">
              <div className="font-display text-2xl tracking-tight text-white">No matches</div>
              <div className="mt-2 text-sm text-white/60">
                Try clearing amenities, widening your price range, or choosing different dates.
              </div>
            </Card>
          ) : null}

          {!error && results.length > 0 ? (
            <div className="grid gap-5">
              {shown.map((h) => (
                <HotelCard key={h.id} hotel={h} />
              ))}
            </div>
          ) : null}

          {results.length > shown.length ? (
            <div className="mt-6 flex justify-center">
              <Button variant="secondary" onClick={() => setVisible((v) => v + 6)}>
                Load more
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
