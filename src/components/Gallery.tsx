import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import StaybeeImage from '@/components/StaybeeImage'
import { cn } from '@/lib/utils'

export default function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const list = useMemo(() => images.filter(Boolean).slice(0, 8), [images])
  const [index, setIndex] = useState(0)
  const active = list[index] || list[0]

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/10">
        {active ? (
          <StaybeeImage
            src={active}
            alt={alt}
            className="h-[360px] w-full object-cover md:h-[420px]"
            loading="lazy"
          />
        ) : (
          <div className="h-[360px] w-full bg-white/5 md:h-[420px]" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
        {list.length > 1 ? (
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <Button
              variant="secondary"
              className="h-10 w-10 rounded-full p-0"
              onClick={() => setIndex((i) => (i - 1 + list.length) % list.length)}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              className="h-10 w-10 rounded-full p-0"
              onClick={() => setIndex((i) => (i + 1) % list.length)}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </div>

      {list.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {list.map((img, i) => (
            <button
              key={`${img}-${i}`}
              onClick={() => setIndex(i)}
              className={cn(
                'relative h-20 w-28 flex-none overflow-hidden rounded-2xl ring-1 transition',
                i === index ? 'ring-honey/30' : 'ring-white/10 hover:ring-white/20',
              )}
              aria-label={`Select image ${i + 1}`}
            >
              <StaybeeImage src={img} alt="" className="h-full w-full object-cover" loading="lazy" />
              <div
                className={cn(
                  'absolute inset-0 transition',
                  i === index ? 'bg-honey/10' : 'bg-ink/20 hover:bg-ink/10',
                )}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

