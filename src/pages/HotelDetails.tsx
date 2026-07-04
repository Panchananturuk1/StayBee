import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check, MapPin } from 'lucide-react'
import { getHotelById } from '@/data/stays'
import Gallery from '@/components/Gallery'
import RoomCard from '@/components/RoomCard'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Rating from '@/components/Rating'
import { useSearchStore } from '@/store/useSearchStore'
import { formatCompactDate, nightsBetween, formatCurrency } from '@/utils/format'

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

  const hotel = useMemo(() => (hotelId ? getHotelById(hotelId) : undefined), [hotelId])

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
            <div className="mt-4 space-y-3 text-sm text-white/60">
              <div className="flex items-center justify-between rounded-2xl bg-white/4 px-4 py-3 ring-1 ring-white/10">
                <div>Check in</div>
                <div className="text-white/85">{checkIn ? formatCompactDate(checkIn) : '—'}</div>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/4 px-4 py-3 ring-1 ring-white/10">
                <div>Check out</div>
                <div className="text-white/85">{checkOut ? formatCompactDate(checkOut) : '—'}</div>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/4 px-4 py-3 ring-1 ring-white/10">
                <div>Guests</div>
                <div className="text-white/85">{guests}</div>
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
              Prices are demo values and may not reflect real-time availability.
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
            <RoomCard
              key={room.id}
              room={room}
              onSelect={(roomId) => navigate('/checkout', { state: { hotelId: hotel.id, roomId } })}
            />
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

