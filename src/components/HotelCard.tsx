import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Hotel } from '@/types/stay'
import Card from '@/components/ui/Card'
import Rating from '@/components/Rating'
import Badge from '@/components/ui/Badge'
import { formatCurrency } from '@/utils/format'
import Button from '@/components/ui/Button'
import { useWishlistStore } from '@/store/useWishlistStore'
import { cn } from '@/lib/utils'

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  const isSaved = useWishlistStore((s) => s.has(hotel.id))
  const toggle = useWishlistStore((s) => s.toggle)

  return (
    <Card className="group overflow-hidden">
      <div className="relative">
        <Link to={`/hotels/${hotel.id}`} className="block">
          <img
            src={hotel.images[0]}
            alt={hotel.name}
            className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
        </Link>

        <div className="absolute left-4 top-4 flex items-center gap-2">
          <Badge tone="neutral">{hotel.propertyType}</Badge>
          {hotel.amenities.includes('breakfast') ? <Badge tone="honey">breakfast</Badge> : null}
        </div>

        <div className="absolute right-4 top-4">
          <Button
            variant="secondary"
            className={cn('h-10 w-10 rounded-full p-0', isSaved ? 'ring-honey/25' : '')}
            onClick={(e) => {
              e.preventDefault()
              toggle(hotel.id)
            }}
            aria-label={isSaved ? 'Remove from saved' : 'Save this hotel'}
          >
            <Heart className={cn('h-4 w-4', isSaved ? 'fill-honey text-honey' : 'text-white/80')} />
          </Button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
          <div>
            <div className="font-display text-lg tracking-tight text-white">{hotel.name}</div>
            <div className="mt-1 text-sm text-white/60">{hotel.location}</div>
          </div>
          <Rating value={hotel.rating} />
        </div>
      </div>

      <div className="p-5">
        <div className="text-sm text-white/60">{hotel.blurb}</div>
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-white/60">
            <span className="text-white/90">{formatCurrency(hotel.priceFrom)}</span>
            <span className="ml-1">/ night</span>
          </div>
          <Link to={`/hotels/${hotel.id}`}>
            <Button size="sm">View rooms</Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

