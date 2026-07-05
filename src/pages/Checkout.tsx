import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2, Shield, Sparkles } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import StaybeeImage from '@/components/StaybeeImage'
import { getHotelById } from '@/data/stays'
import { useSearchStore } from '@/store/useSearchStore'
import { useBookingStore } from '@/store/useBookingStore'
import { useSessionStore } from '@/store/useSessionStore'
import { formatCompactDate, formatCurrency, nightsBetween } from '@/utils/format'

type CheckoutState = { hotelId: string; roomId: string } | null

export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as CheckoutState) || null

  const checkIn = useSearchStore((s) => s.checkIn)
  const checkOut = useSearchStore((s) => s.checkOut)
  const guests = useSearchStore((s) => s.guests)
  const setBasics = useSearchStore((s) => s.setBasics)

  const createBooking = useBookingStore((s) => s.createBooking)
  const bookingLoading = useBookingStore((s) => s.isLoading)
  const user = useSessionStore((s) => s.user)

  const hotel = useMemo(() => (state ? getHotelById(state.hotelId) : undefined), [state])
  const room = useMemo(() => hotel?.rooms.find((r) => r.id === state?.roomId), [hotel, state?.roomId])

  const [fullName, setFullName] = useState(user?.fullName || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    setFullName((current) => current || user.fullName)
    setEmail((current) => current || user.email)
  }, [user])

  const nights = nightsBetween(checkIn, checkOut) || 1
  const total = room ? room.pricePerNight * nights : 0

  const errors = {
    fullName: !fullName.trim() ? 'Full name is required.' : '',
    email: !email.trim() || !email.includes('@') ? 'Enter a valid email.' : '',
    phone: !phone.trim() ? 'Phone is required.' : '',
    dates: !checkIn || !checkOut ? 'Select check-in and check-out dates.' : '',
  }

  const hasBlockingErrors = Boolean(errors.fullName || errors.email || errors.phone || errors.dates)

  if (!state || !hotel || !room) {
    return (
      <Card className="p-8">
        <div className="font-display text-2xl tracking-tight text-white">Checkout needs a room</div>
        <div className="mt-2 text-sm text-white/60">
          Start from a hotel page and select a room to continue.
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/search">
            <Button>Go to search</Button>
          </Link>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="p-8">
        <div className="font-display text-2xl tracking-tight text-white">Sign in to complete your booking</div>
        <div className="mt-2 text-sm text-white/60">
          Your booking history now syncs from the database, so you need an account before confirming a stay.
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            onClick={() =>
              navigate('/auth', {
                state: {
                  redirectTo: '/checkout',
                  redirectState: state,
                },
              })
            }
          >
            Sign in or create account
          </Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </Card>
    )
  }

  if (bookingId) {
    return (
      <Card className="p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-honey/14 px-4 py-2 text-xs text-honey ring-1 ring-honey/18">
              <Sparkles className="h-4 w-4" />
              Booking confirmed
            </div>
            <div className="mt-6 font-display text-3xl tracking-tight text-white">You’re all set.</div>
            <div className="mt-3 text-sm text-white/65">
              Your booking has been saved to the database.
            </div>
          </div>
          <CheckCircle2 className="h-12 w-12 text-honey" />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Card className="p-5">
            <div className="text-xs font-medium tracking-wide text-white/55">Booking ID</div>
            <div className="mt-2 font-display text-xl tracking-tight text-white">{bookingId}</div>
          </Card>
          <Card className="p-5">
            <div className="text-xs font-medium tracking-wide text-white/55">Stay</div>
            <div className="mt-2 text-sm text-white/75">{hotel.name}</div>
            <div className="mt-1 text-xs text-white/45">{hotel.location}</div>
          </Card>
          <Card className="p-5">
            <div className="text-xs font-medium tracking-wide text-white/55">Total</div>
            <div className="mt-2 font-display text-xl tracking-tight text-white">{formatCurrency(total)}</div>
          </Card>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/bookings">
            <Button>View bookings</Button>
          </Link>
          <Link to="/search">
            <Button variant="secondary">Book another stay</Button>
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-12 md:items-start">
      <div className="md:col-span-7">
        <Card className="p-6">
          <div className="text-xs font-medium tracking-wide text-white/55">Checkout</div>
          <div className="mt-2 font-display text-3xl tracking-tight text-white">Guest details</div>
          <div className="mt-2 text-sm text-white/60">
            One clean form. A subtle sense of certainty.
          </div>

          <div className="mt-6 grid gap-4">
            <Input
              label="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={submitted ? errors.fullName : ''}
              placeholder="e.g. Alex Rivera"
            />
            <Input
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={submitted ? errors.email : ''}
              placeholder="you@example.com"
            />
            <Input
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={submitted ? errors.phone : ''}
              placeholder="+1 555 0100"
            />

            <div className="grid gap-3 md:grid-cols-2">
              <Input
                label="Check in"
                type="date"
                value={checkIn}
                onChange={(e) => setBasics({ checkIn: e.target.value })}
                error={submitted ? errors.dates : ''}
              />
              <Input
                label="Check out"
                type="date"
                value={checkOut}
                onChange={(e) => setBasics({ checkOut: e.target.value })}
                error={submitted ? errors.dates : ''}
              />
            </div>

            <div className="rounded-3xl bg-white/4 p-4 ring-1 ring-white/10">
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-5 w-5 text-honey" />
                <div>
                  <div className="text-sm text-white/75">Demo booking safety</div>
                  <div className="mt-1 text-xs text-white/50">
                    No payment details are collected. Booking details are stored in your account.
                  </div>
                </div>
              </div>
            </div>

            {error ? <div className="rounded-2xl bg-red-400/10 px-4 py-3 text-sm text-red-100 ring-1 ring-red-300/20">{error}</div> : null}

            <Button
              className="h-12"
              disabled={bookingLoading}
              onClick={async () => {
                setSubmitted(true)
                setError(null)
                if (hasBlockingErrors) return
                const result = await createBooking({
                  hotelId: hotel.id,
                  roomId: room.id,
                  dateRange: { checkIn, checkOut },
                  guests,
                  guestInfo: { fullName: fullName.trim(), email: email.trim(), phone: phone.trim() },
                  totalPrice: total,
                })
                if (result.ok === false) {
                  setError(result.message)
                  return
                }

                setBookingId(result.booking.id)
              }}
            >
              {bookingLoading ? 'Saving booking...' : 'Confirm booking'}
            </Button>

            <Button variant="ghost" className="h-11" disabled={bookingLoading} onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
        </Card>
      </div>

      <div className="md:col-span-5">
        <Card className="sticky top-28 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-display text-2xl tracking-tight text-white">{hotel.name}</div>
              <div className="mt-1 text-sm text-white/55">{hotel.location}</div>
            </div>
            <Badge tone="honey">{room.refundable ? 'refundable' : 'non‑refundable'}</Badge>
          </div>

          <div className="mt-5 overflow-hidden rounded-3xl ring-1 ring-white/10">
            <StaybeeImage
              src={hotel.images[1] || hotel.images[0]}
              alt={hotel.name}
              className="h-48 w-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="mt-5 space-y-3 text-sm text-white/60">
            <div className="flex items-center justify-between rounded-2xl bg-white/4 px-4 py-3 ring-1 ring-white/10">
              <div>Room</div>
              <div className="text-white/85">{room.name}</div>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/4 px-4 py-3 ring-1 ring-white/10">
              <div>Nights</div>
              <div className="text-white/85">{nights}</div>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/4 px-4 py-3 ring-1 ring-white/10">
              <div>Dates</div>
              <div className="text-white/85">
                {checkIn && checkOut ? `${formatCompactDate(checkIn)} → ${formatCompactDate(checkOut)}` : '—'}
              </div>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-white/4 px-4 py-3 ring-1 ring-white/10">
              <div>Guests</div>
              <div className="text-white/85">{guests}</div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-honey/10 px-5 py-4 ring-1 ring-honey/15">
            <div className="flex items-baseline justify-between gap-4">
              <div className="text-sm text-white/65">Total</div>
              <div className="font-display text-3xl tracking-tight text-white">{formatCurrency(total)}</div>
            </div>
            <div className="mt-2 text-xs text-white/45">
              {formatCurrency(room.pricePerNight)} / night × {nights} night{nights === 1 ? '' : 's'}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
