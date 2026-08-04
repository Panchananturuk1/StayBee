import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { deleteAdminHotel, fetchAdminHotels, fetchHotelById, saveAdminHotel } from '@/services/hotels'
import { useSessionStore } from '@/store/useSessionStore'
import type { Hotel, PropertyType, Room } from '@/types/stay'

const propertyTypes: PropertyType[] = ['hotel', 'resort', 'boutique', 'apartment']

const emptyHotel = (): Hotel => ({
  id: '',
  name: '',
  location: '',
  propertyType: 'hotel',
  images: [''],
  rating: 4.5,
  reviewCount: 0,
  priceFrom: 0,
  amenities: ['wifi'],
  blurb: '',
  rooms: [
    {
      id: '',
      name: '',
      occupancy: 2,
      refundable: true,
      pricePerNight: 1999,
      basePrice: 1999,
      totalUnits: 2,
      images: [''],
    },
  ],
  reviews: [],
})

export default function AdminHotelEdit() {
  const navigate = useNavigate()
  const { hotelId } = useParams()
  const user = useSessionStore((s) => s.user)
  const isNew = hotelId === 'new'

  const [hotel, setHotel] = useState<Hotel>(emptyHotel())
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!hotelId || isNew) return
    void fetchHotelById(hotelId).then(setHotel).catch(() => setError('Unable to load this hotel.'))
  }, [hotelId, isNew])

  if (!user || user.role !== 'admin') {
    return (
      <Card className="p-10">
        <div className="font-display text-2xl tracking-tight text-white">Admin access required</div>
      </Card>
    )
  }

  const updateRoom = (index: number, patch: Partial<Room>) => {
    setHotel((current) => ({
      ...current,
      rooms: current.rooms.map((room, roomIndex) => (roomIndex === index ? { ...room, ...patch } : room)),
    }))
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <div className="text-xs font-medium tracking-wide text-white/55">Admin</div>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-white">
          {isNew ? 'Add hotel' : 'Edit hotel'}
        </h1>
      </div>

      <Card className="space-y-4 p-6">
        <Input
          label="Hotel id"
          value={hotel.id}
          disabled={!isNew}
          onChange={(e) => setHotel({ ...hotel, id: e.target.value })}
          hint="Use a stable slug like hb-aurora-delhi"
        />
        <Input label="Name" value={hotel.name} onChange={(e) => setHotel({ ...hotel, name: e.target.value })} />
        <Input
          label="Location"
          value={hotel.location}
          onChange={(e) => setHotel({ ...hotel, location: e.target.value })}
        />
        <label className="block">
          <div className="mb-2 text-xs font-medium tracking-wide text-white/70">Property type</div>
          <select
            className="h-11 w-full rounded-2xl bg-white/5 px-4 text-sm text-white ring-1 ring-white/10"
            value={hotel.propertyType}
            onChange={(e) => setHotel({ ...hotel, propertyType: e.target.value as PropertyType })}
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>
        <Input label="Blurb" value={hotel.blurb} onChange={(e) => setHotel({ ...hotel, blurb: e.target.value })} />
        <Input
          label="Cover image URL"
          value={hotel.images[0] || ''}
          onChange={(e) => setHotel({ ...hotel, images: [e.target.value] })}
        />
        <Input
          label="Amenities (comma separated)"
          value={hotel.amenities.join(', ')}
          onChange={(e) =>
            setHotel({
              ...hotel,
              amenities: e.target.value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean) as Hotel['amenities'],
            })
          }
        />
      </Card>

      <div className="space-y-4">
        <div className="font-display text-2xl tracking-tight text-white">Rooms</div>
        {hotel.rooms.map((room, index) => (
          <Card key={index} className="space-y-4 p-6">
            <Input
              label="Room id"
              value={room.id}
              onChange={(e) => updateRoom(index, { id: e.target.value })}
            />
            <Input
              label="Room name"
              value={room.name}
              onChange={(e) => updateRoom(index, { name: e.target.value })}
            />
            <div className="grid gap-4 md:grid-cols-3">
              <Input
                label="Base price (INR)"
                type="number"
                value={room.basePrice ?? room.pricePerNight}
                onChange={(e) =>
                  updateRoom(index, {
                    basePrice: Number(e.target.value),
                    pricePerNight: Number(e.target.value),
                  })
                }
              />
              <Input
                label="Total units"
                type="number"
                value={room.totalUnits ?? 2}
                onChange={(e) => updateRoom(index, { totalUnits: Number(e.target.value) })}
              />
              <Input
                label="Occupancy"
                type="number"
                value={room.occupancy}
                onChange={(e) => updateRoom(index, { occupancy: Number(e.target.value) })}
              />
            </div>
            <Input
              label="Room image URL"
              value={room.images[0] || ''}
              onChange={(e) => updateRoom(index, { images: [e.target.value] })}
            />
          </Card>
        ))}
        <Button
          variant="secondary"
          onClick={() =>
            setHotel({
              ...hotel,
              rooms: [
                ...hotel.rooms,
                {
                  id: '',
                  name: '',
                  occupancy: 2,
                  refundable: true,
                  pricePerNight: 1999,
                  basePrice: 1999,
                  totalUnits: 2,
                  images: [''],
                },
              ],
            })
          }
        >
          Add room
        </Button>
      </div>

      {error ? <Card className="p-4 text-sm text-red-100">{error}</Card> : null}

      <div className="flex flex-wrap gap-3">
        <Button
          disabled={isSaving}
          onClick={async () => {
            setError(null)
            setIsSaving(true)
            try {
              await saveAdminHotel(hotel, isNew ? 'create' : 'edit')
              await fetchAdminHotels()
              navigate('/admin/hotels')
            } catch (saveError) {
              setError(saveError instanceof Error ? saveError.message : 'Unable to save hotel.')
            } finally {
              setIsSaving(false)
            }
          }}
        >
          {isSaving ? 'Saving…' : 'Save hotel'}
        </Button>
        {!isNew ? (
          <Button
            variant="danger"
            disabled={isSaving}
            onClick={async () => {
              setIsSaving(true)
              try {
                await deleteAdminHotel(hotel.id)
                navigate('/admin/hotels')
              } catch {
                setError('Unable to delete this hotel.')
              } finally {
                setIsSaving(false)
              }
            }}
          >
            Delete
          </Button>
        ) : null}
        <Button variant="secondary" onClick={() => navigate('/admin/hotels')}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
