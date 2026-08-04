import type { Room } from '@/types/stay'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { formatCurrency } from '@/utils/format'
import StaybeeImage from '@/components/StaybeeImage'

export default function RoomCard({
  room,
  onSelect,
}: {
  room: Room
  onSelect: (roomId: string) => void
}) {
  const availabilityLabel =
    room.soldOut
      ? 'Sold out for selected dates'
      : room.limited && typeof room.availableUnits === 'number'
        ? `Only ${room.availableUnits} left`
        : typeof room.availableUnits === 'number'
          ? `${room.availableUnits} rooms available`
          : null

  return (
    <Card className="overflow-hidden">
      <div className="grid gap-4 md:grid-cols-12 md:items-stretch">
        <div className="md:col-span-5">
          <StaybeeImage
            src={room.images[0]}
            alt={room.name}
            className="h-52 w-full object-cover md:h-full"
            loading="lazy"
          />
        </div>
        <div className="flex flex-col justify-between p-5 md:col-span-7">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="font-display text-xl tracking-tight text-white">{room.name}</div>
              <div className="flex items-center gap-2">
                <Badge tone="neutral">up to {room.occupancy}</Badge>
                <Badge tone={room.refundable ? 'good' : 'bad'}>
                  {room.refundable ? 'refundable' : 'non‑refundable'}
                </Badge>
                {room.limited ? <Badge tone="honey">Limited</Badge> : null}
                {room.soldOut ? <Badge tone="bad">Sold out</Badge> : null}
              </div>
            </div>

            <div className="mt-3 text-sm text-white/60">
              {availabilityLabel || 'A calm, well-lit room with fast check-in and a clean, quiet layout.'}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="text-sm text-white/60">
              <span className="text-white/90">{formatCurrency(room.pricePerNight)}</span> / night
              {typeof room.stayTotal === 'number' && room.stayTotal > 0 ? (
                <div className="mt-1 text-xs text-white/45">
                  Stay total {formatCurrency(room.stayTotal)}
                </div>
              ) : null}
            </div>
            <Button disabled={room.soldOut} onClick={() => onSelect(room.id)}>
              {room.soldOut ? 'Unavailable' : 'Select'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
