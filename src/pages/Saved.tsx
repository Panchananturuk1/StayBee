import { Link } from 'react-router-dom'
import { HeartOff, Sparkles } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import HotelCard from '@/components/HotelCard'
import { hotels } from '@/data/stays'
import { useWishlistStore } from '@/store/useWishlistStore'

export default function Saved() {
  const savedIds = useWishlistStore((s) => s.hotelIds)
  const clear = useWishlistStore((s) => s.clear)

  const saved = hotels.filter((h) => savedIds.includes(h.id))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xs font-medium tracking-wide text-white/55">Wishlist</div>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-white">Saved stays</h1>
          <div className="mt-2 text-sm text-white/60">A short list of places you might return to.</div>
        </div>

        {saved.length ? (
          <Button variant="secondary" onClick={clear}>
            <HeartOff className="h-4 w-4" />
            Clear
          </Button>
        ) : null}
      </div>

      {saved.length === 0 ? (
        <Card className="p-10">
          <div className="flex items-start gap-4">
            <Sparkles className="h-6 w-6 text-honey" />
            <div>
              <div className="font-display text-2xl tracking-tight text-white">Nothing saved yet</div>
              <div className="mt-2 text-sm text-white/60">
                Tap the heart on a hotel card to keep it here.
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
        <div className="grid gap-5 md:grid-cols-3">
          {saved.map((h) => (
            <HotelCard key={h.id} hotel={h} />
          ))}
        </div>
      )}
    </div>
  )
}

