import { Calendar, MapPin, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useSearchStore } from '@/store/useSearchStore'

export default function SearchBar() {
  const navigate = useNavigate()
  const location = useSearchStore((s) => s.location)
  const checkIn = useSearchStore((s) => s.checkIn)
  const checkOut = useSearchStore((s) => s.checkOut)
  const guests = useSearchStore((s) => s.guests)
  const setBasics = useSearchStore((s) => s.setBasics)

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
            value={checkIn}
            onChange={(e) => setBasics({ checkIn: e.target.value })}
          />
        </div>
        <div className="md:col-span-3">
          <Input
            label="Check out"
            type="date"
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
        <div className="flex flex-wrap items-center gap-3 text-xs text-white/45">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/4 px-3 py-2 ring-1 ring-white/10">
            <MapPin className="h-4 w-4 text-white/55" />
            Smart location hints
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/4 px-3 py-2 ring-1 ring-white/10">
            <Calendar className="h-4 w-4 text-white/55" />
            Flexible dates
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/4 px-3 py-2 ring-1 ring-white/10">
            <Users className="h-4 w-4 text-white/55" />
            Instant booking summary
          </div>
        </div>
        <Button
          onClick={() => navigate('/search')}
          className="h-12 px-7"
        >
          Search stays
        </Button>
      </div>
    </Card>
  )
}

