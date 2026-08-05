import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarX2, ReceiptText } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useBookingStore } from '@/store/useBookingStore'
import { useSessionStore } from '@/store/useSessionStore'
import { formatCompactDate, formatCurrency } from '@/utils/format'
import StaybeeImage from '@/components/StaybeeImage'

export default function Bookings() {
  const navigate = useNavigate()
  const bookings = useBookingStore((s) => s.bookings)
  const isLoading = useBookingStore((s) => s.isLoading)
  const loadBookings = useBookingStore((s) => s.loadBookings)
  const cancelBooking = useBookingStore((s) => s.cancelBooking)
  const user = useSessionStore((s) => s.user)
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    void loadBookings()
  }, [loadBookings, user])

  if (!user) {
    return (
      <Card className="p-10">
        <div className="flex items-start gap-4">
          <ReceiptText className="h-6 w-6 text-honey" />
          <div>
            <div className="font-display text-2xl tracking-tight text-white">Sign in to view bookings</div>
            <div className="mt-2 text-sm text-white/60">
              Booking history now comes from the database and is linked to your account.
            </div>
            <div className="mt-6">
              <Button onClick={() => navigate('/auth', { state: { redirectTo: '/bookings' } })}>Sign in</Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-medium tracking-wide text-white/55">Account</div>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-white">My bookings</h1>
        <div className="mt-2 text-sm text-white/60">Bookings sync with your account in the database.</div>
      </div>

      {bookings.length === 0 ? (
        <Card className="p-10">
          <div className="flex items-start gap-4">
            <ReceiptText className="h-6 w-6 text-honey" />
            <div>
              <div className="font-display text-2xl tracking-tight text-white">{isLoading ? 'Loading bookings...' : 'No bookings yet'}</div>
              <div className="mt-2 text-sm text-white/60">
                {isLoading ? 'Fetching your latest bookings from the database.' : 'Pick a stay, select a room, and confirm — you’ll see it here.'}
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
            const hotelName = b.hotel?.name || 'Unknown hotel'
            const hotelLocation = b.hotel?.location
            const hotelImage = b.hotel?.images?.[0]
            const roomName = b.room?.name || 'Room'
            const isCancelled = b.status === 'cancelled'
            return (
              <Card key={b.id} className="overflow-hidden">
                <div className="grid gap-4 md:grid-cols-12 md:items-stretch">
                  <div className="md:col-span-4">
                    <StaybeeImage
                      src={hotelImage}
                      alt={hotelName}
                      className="h-48 w-full object-cover md:h-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 md:col-span-8">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="font-display text-2xl tracking-tight text-white">
                          {hotelName}
                        </div>
                        <div className="mt-1 text-sm text-white/55">{hotelLocation}</div>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Badge tone={isCancelled ? 'bad' : 'good'}>
                            {isCancelled ? 'cancelled' : 'confirmed'}
                          </Badge>
                          <Badge tone="neutral">{roomName}</Badge>
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
                            disabled={isLoading}
                            onClick={async () => {
                              const result = await cancelBooking(b.id)
                              if (result.ok === false) {
                                return
                              }
                              setConfirmCancel(null)
                            }}
                          >
                            Confirm cancel
                          </Button>
                          <Button variant="secondary" size="sm" disabled={isLoading} onClick={() => setConfirmCancel(null)}>
                            Keep booking
                          </Button>
                        </div>
                      ) : (
                        <Button variant="secondary" size="sm" disabled={isLoading} onClick={() => setConfirmCancel(b.id)}>
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
