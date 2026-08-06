import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, MapPin, Minus, Plus } from 'lucide-react'
import AvailabilityCalendar from '@/components/AvailabilityCalendar'
import Gallery from '@/components/Gallery'
import RoomCard from '@/components/RoomCard'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Rating from '@/components/Rating'
import { useRoomAvailability } from '@/hooks/useRoomAvailability'
import { fetchHotelById } from '@/services/hotels'
import { useSearchStore } from '@/store/useSearchStore'
import type { Hotel } from '@/types/stay'
import {
  addDaysToDateInput,
  formatCompactDate,
  formatCurrency,
  nightsBetween,
  todayDateInputValue,
  toDateInputValue,
} from '@/utils/format'

const amenityLabels: Record<string, string> = {
  wifi: 'Wi‑Fi',
  breakfast: 'Breakfast',
  pool: 'Pool',
  spa: 'Spa',
  gym: 'Gym',
  parking: 'Parking',
  petFriendly: 'Pet friendly',
  seaView: 'Sea view',
}

export default function HotelDetails() {
  const navigate = useNavigate()
  const { hotelId } = useParams()

  const checkIn = useSearchStore((s) => s.checkIn)
  const checkOut = useSearchStore((s) => s.checkOut)
  const guests = useSearchStore((s) => s.guests)
  const setBasics = useSearchStore((s) => s.setBasics)

  const today = todayDateInputValue()
  const minCheckOut = checkIn ? addDaysToDateInput(checkIn, 1) : addDaysToDateInput(today, 1)

  useEffect(() => {
    const { checkIn: currentCheckIn, checkOut: currentCheckOut, setBasics: updateBasics } =
      useSearchStore.getState()
    if (currentCheckIn && currentCheckOut) return

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dayAfter = new Date()
    dayAfter.setDate(dayAfter.getDate() + 2)

    updateBasics({
      checkIn: currentCheckIn || toDateInputValue(tomorrow),
      checkOut: currentCheckOut || toDateInputValue(dayAfter),
    })
  }, [])

  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRoomId, setSelectedRoomId] = useState('')

  useEffect(() => {
    if (!hotelId) return

    let cancelled = false
    setIsLoading(true)

    void fetchHotelById(hotelId, checkIn, checkOut)
      .then((data) => {
        if (cancelled) return
        setHotel(data)
        setSelectedRoomId((current) => current || data.rooms[0]?.id || '')
      })
      .catch(() => {
        if (cancelled) return
        setHotel(null)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [checkIn, checkOut, hotelId])

  const { days, isLoading: calendarLoading } = useRoomAvailability(
    hotel?.id || '',
    selectedRoomId,
  )

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="font-display text-2xl tracking-tight text-white">Loading hotel…</div>
      </Card>
    )
  }

  if (!hotel) {
    return (
      <Card className="p-8">
        <div className="font-display text-2xl tracking-tight text-white">Hotel not found</div>
        <div className="mt-2 text-sm text-white/60">
          This demo dataset might have changed. Return to search.
        </div>
        <div className="mt-6">
          <Link to="/search">
            <Button>Back to search</Button>
          </Link>
        </div>
      </Card>
    )
  }

  const nights = nightsBetween(checkIn, checkOut) || 1

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="h-10 px-3" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="font-display text-3xl tracking-tight text-white">{hotel.name}</div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-white/60">
              <div className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-white/40" />
                {hotel.location}
              </div>
              <span className="text-white/30">•</span>
              <div className="text-white/55">{hotel.propertyType}</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Rating value={hotel.rating} />
          <div className="text-sm text-white/55">{hotel.reviewCount} reviews</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12 md:items-start">
        <div className="md:col-span-8">
          <Gallery images={hotel.images} alt={hotel.name} />
        </div>

        <div className="md:col-span-4">
          <Card className="sticky top-28 p-5">
            <div className="text-xs font-medium tracking-wide text-white/55">Your plan</div>
            <div className="mt-2 font-display text-xl tracking-tight text-white">Dates & guests</div>
            <div className="mt-4 space-y-3">
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
                className="[color-scheme:dark]"
              />
              <Input
                label="Check out"
                type="date"
                min={minCheckOut}
                value={checkOut}
                onChange={(e) => setBasics({ checkOut: e.target.value })}
                className="[color-scheme:dark]"
              />
              <div>
                <div className="mb-2 text-xs font-medium tracking-wide text-white/70">Guests</div>
                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2 ring-1 ring-white/10">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 px-0"
                    disabled={guests <= 1}
                    aria-label="Decrease guests"
                    onClick={() => setBasics({ guests: Math.max(1, guests - 1) })}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="min-w-[2rem] text-center text-sm font-medium text-white">{guests}</div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 px-0"
                    disabled={guests >= 6}
                    aria-label="Increase guests"
                    onClick={() => setBasics({ guests: Math.min(6, guests + 1) })}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-3xl bg-honey/10 px-4 py-4 text-sm text-white/70 ring-1 ring-honey/15">
              Select a room to continue. Total will be calculated for <span className="text-white">{nights}</span>{' '}
              night{nights === 1 ? '' : 's'}.
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8">
          <Card className="p-6">
            <div className="text-xs font-medium tracking-wide text-white/55">About</div>
            <div className="mt-2 font-display text-2xl tracking-tight text-white">A stay with quiet confidence</div>
            <p className="mt-3 text-sm text-white/65">{hotel.blurb}</p>

            <div className="mt-6">
              <div className="text-xs font-medium tracking-wide text-white/55">Amenities</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {hotel.amenities.map((a) => (
                  <Badge key={a} tone="neutral">
                    <Check className="mr-2 h-3.5 w-3.5 text-honey" />
                    {amenityLabels[a] ?? a}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        </div>
        <div className="md:col-span-4">
          <Card className="p-6">
            <div className="text-xs font-medium tracking-wide text-white/55">From</div>
            <div className="mt-2 font-display text-3xl tracking-tight text-white">
              {formatCurrency(hotel.priceFrom)}
              <span className="ml-2 text-base text-white/55">/ night</span>
            </div>
            <div className="mt-4 text-sm text-white/60">
              Prices update by date, with weekend rates on Friday and Saturday.
            </div>
            <div className="mt-6">
              <Link to="/search">
                <Button variant="secondary" className="w-full">
                  Back to results
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <div className="text-xs font-medium tracking-wide text-white/55">Rooms</div>
          <h2 className="mt-2 font-display text-3xl tracking-tight text-white">Pick your room</h2>
        </div>
        <div className="space-y-4">
          {hotel.rooms.map((room) => (
            <div key={room.id} className="space-y-4">
              <RoomCard
                room={room}
                onSelect={(roomId) => {
                  setSelectedRoomId(roomId)
                  navigate('/checkout', { state: { hotelId: hotel.id, roomId } })
                }}
              />
              {selectedRoomId === room.id ? (
                <AvailabilityCalendar days={days} isLoading={calendarLoading} />
              ) : (
                <div className="flex justify-end">
                  <Button variant="secondary" onClick={() => setSelectedRoomId(room.id)}>
                    View availability calendar
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <div className="text-xs font-medium tracking-wide text-white/55">Reviews</div>
          <h2 className="mt-2 font-display text-3xl tracking-tight text-white">What guests say</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {hotel.reviews.map((r) => (
            <Card key={r.id} className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-display text-xl tracking-tight text-white">{r.title}</div>
                  <div className="mt-1 text-sm text-white/55">
                    {r.author} • {formatCompactDate(r.date)}
                  </div>
                </div>
                <Badge tone="honey">{r.rating.toFixed(1)}</Badge>
              </div>
              <div className="mt-4 text-sm text-white/65">{r.body}</div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}

