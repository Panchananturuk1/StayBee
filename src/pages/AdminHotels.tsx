import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Building2, Plus } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { fetchAdminHotels } from '@/services/hotels'
import { useSessionStore } from '@/store/useSessionStore'
import { formatCurrency } from '@/utils/format'
import type { Hotel } from '@/types/stay'

export default function AdminHotels() {
  const navigate = useNavigate()
  const user = useSessionStore((s) => s.user)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role !== 'admin') return
    void fetchAdminHotels()
      .then(setHotels)
      .catch(() => setError('Unable to load admin hotels.'))
  }, [user?.role])

  if (!user) {
    return (
      <Card className="p-10">
        <div className="font-display text-2xl tracking-tight text-white">Sign in to manage inventory</div>
        <div className="mt-6">
          <Button onClick={() => navigate('/auth', { state: { redirectTo: '/admin/hotels' } })}>Sign in</Button>
        </div>
      </Card>
    )
  }

  if (user.role !== 'admin') {
    return (
      <Card className="p-10">
        <div className="font-display text-2xl tracking-tight text-white">Admin access required</div>
        <div className="mt-2 text-sm text-white/60">
          Add your email to `ADMIN_EMAILS` in the environment or set your account role to ADMIN.
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-medium tracking-wide text-white/55">Admin</div>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-white">Hotel inventory</h1>
          <div className="mt-2 text-sm text-white/60">Add, edit, and manage live hotel listings in Postgres.</div>
        </div>
        <Button onClick={() => navigate('/admin/hotels/new')}>
          <Plus className="h-4 w-4" />
          Add hotel
        </Button>
      </div>

      {error ? <Card className="p-6 text-sm text-red-100">{error}</Card> : null}

      <div className="grid gap-4">
        {hotels.map((hotel) => (
          <Card key={hotel.id} className="p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm text-white/55">
                  <Building2 className="h-4 w-4" />
                  {hotel.propertyType}
                </div>
                <div className="mt-1 font-display text-2xl tracking-tight text-white">{hotel.name}</div>
                <div className="mt-1 text-sm text-white/60">
                  {hotel.location} • {hotel.rooms.length} rooms • from {formatCurrency(hotel.priceFrom)}
                </div>
              </div>
              <Link to={`/admin/hotels/${hotel.id}`}>
                <Button variant="secondary">Edit property</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
