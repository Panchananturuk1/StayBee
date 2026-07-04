import type { Amenity, PropertyType } from '@/types/stay'
import Card from '@/components/ui/Card'
import Chip from '@/components/ui/Chip'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useSearchStore } from '@/store/useSearchStore'

const amenityOptions: { key: Amenity; label: string }[] = [
  { key: 'wifi', label: 'Wi‑Fi' },
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'pool', label: 'Pool' },
  { key: 'spa', label: 'Spa' },
  { key: 'gym', label: 'Gym' },
  { key: 'parking', label: 'Parking' },
  { key: 'petFriendly', label: 'Pet friendly' },
  { key: 'seaView', label: 'Sea view' },
]

const propertyTypeOptions: { key: PropertyType; label: string }[] = [
  { key: 'hotel', label: 'Hotel' },
  { key: 'resort', label: 'Resort' },
  { key: 'boutique', label: 'Boutique' },
  { key: 'apartment', label: 'Apartment' },
]

export default function FiltersPanel() {
  const filters = useSearchStore((s) => s.filters)
  const setFilters = useSearchStore((s) => s.setFilters)
  const toggleAmenity = useSearchStore((s) => s.toggleAmenity)
  const togglePropertyType = useSearchStore((s) => s.togglePropertyType)
  const reset = useSearchStore((s) => s.reset)

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="font-display text-xl tracking-tight text-white">Filters</div>
        <Button variant="ghost" size="sm" className="h-9 px-4" onClick={reset}>
          Reset
        </Button>
      </div>

      <div className="mt-6 space-y-6">
        <div>
          <div className="text-xs font-medium tracking-wide text-white/55">Price / night</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Input
              label="Min"
              type="number"
              min={0}
              value={filters.minPrice ?? ''}
              onChange={(e) => setFilters({ minPrice: e.target.value ? Number(e.target.value) : undefined })}
            />
            <Input
              label="Max"
              type="number"
              min={0}
              value={filters.maxPrice ?? ''}
              onChange={(e) => setFilters({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
            />
          </div>
        </div>

        <div>
          <div className="text-xs font-medium tracking-wide text-white/55">Minimum rating</div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[4.0, 4.5, 4.7].map((r) => (
              <Chip
                key={r}
                selected={filters.minRating === r}
                onClick={() => setFilters({ minRating: filters.minRating === r ? undefined : r })}
              >
                {r.toFixed(1)}+
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium tracking-wide text-white/55">Amenities</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {amenityOptions.map((a) => (
              <Chip
                key={a.key}
                selected={filters.amenities.includes(a.key)}
                onClick={() => toggleAmenity(a.key)}
              >
                {a.label}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-medium tracking-wide text-white/55">Property type</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {propertyTypeOptions.map((p) => (
              <Chip
                key={p.key}
                selected={filters.propertyTypes.includes(p.key)}
                onClick={() => togglePropertyType(p.key)}
              >
                {p.label}
              </Chip>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

