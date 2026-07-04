import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarX2, ReceiptText } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { hotels } from '@/data/stays'
import { useBookingStore } from '@/store/useBookingStore'
import { formatCompactDate, formatCurrency } from '@/utils/format'

export default function Bookings() {
  const bookings = useBookingStore((s) => s.bookings)
  const cancelBooking = useBookingStore((s) => s.cancelBooking)
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null)

  const hotelById = useMemo(() => new Map(hotels.map((h) => [h.id, h])), [])

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-medium tracking-wide text-white/55">Account</div>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-white">My bookings</h1>
        <div className="mt-2 text-sm text-white/60">Bookings live in localStorage for this demo.</div>
      </div>

      {bookings.length === 0 ? (
        <Card className="p-10">
          <div className="flex items-start gap-4">
            <ReceiptText className="h-6 w-6 text-honey" />
            <div>
              <div className="font-display text-2xl tracking-tight text-white">No bookings yet</div>
              <div className="mt-2 text-sm text-white/60">
                Pick a stay, select a room, and confirm — you’ll see it here.
              </div>
              <div className="mt-6">
                <Link to="/search">
                  <Button>Explore stays</Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b) => {
            const hotel = hotelById.get(b.hotelId)
            const room = hotel?.rooms.find((r) => r.id === b.roomId)
            const isCancelled = b.status === 'cancelled'
            return (
              <Card key={b.id} className="overflow-hidden">
                <div className="grid gap-4 md:grid-cols-12 md:items-stretch">
                  <div className="md:col-span-4">
                    <img
                      src={hotel?.images[0]}
                      alt={hotel?.name || 'Hotel'}
                      className="h-48 w-full object-cover md:h-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 md:col-span-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="font-display text-2xl tracking-tight text-white">
                          {hotel?.name || 'Unknown hotel'}
                        </div>
                        <div className="mt-1 text-sm text-white/55">{hotel?.location}</div>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Badge tone={isCancelled ? 'bad' : 'good'}>
                            {isCancelled ? 'cancelled' : 'confirmed'}
                          </Badge>
                          <Badge tone="neutral">{room?.name || 'Room'}</Badge>
                          <Badge tone="neutral">{b.guests} guests</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium tracking-wide text-white/55">Total</div>
                        <div className="mt-1 font-display text-2xl tracking-tight text-white">
                          {formatCurrency(b.totalPrice)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                      <div className="rounded-2xl bg-white/4 px-4 py-3 ring-1 ring-white/10">
                        <div className="text-xs text-white/45">Check in</div>
                        <div className="mt-1 text-sm text-white/80">{formatCompactDate(b.dateRange.checkIn)}</div>
                      </div>
                      <div className="rounded-2xl bg-white/4 px-4 py-3 ring-1 ring-white/10">
                        <div className="text-xs text-white/45">Check out</div>
                        <div className="mt-1 text-sm text-white/80">{formatCompactDate(b.dateRange.checkOut)}</div>
                      </div>
                      <div className="rounded-2xl bg-white/4 px-4 py-3 ring-1 ring-white/10">
                        <div className="text-xs text-white/45">Booking ID</div>
                        <div className="mt-1 truncate text-sm text-white/80">{b.id}</div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-white/45">
                        Guest: {b.guestInfo.fullName} • {b.guestInfo.email}
                      </div>
                      {isCancelled ? (
                        <div className="inline-flex items-center gap-2 text-xs text-white/45">
                          <CalendarX2 className="h-4 w-4" />
                          Cancelled
                        </div>
                      ) : confirmCancel === b.id ? (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              cancelBooking(b.id)
                              setConfirmCancel(null)
                            }}
                          >
                            Confirm cancel
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => setConfirmCancel(null)}>
                            Keep booking
                          </Button>
                        </div>
                      ) : (
                        <Button variant="secondary" size="sm" onClick={() => setConfirmCancel(b.id)}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

