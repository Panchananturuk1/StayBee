import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Rating({ value, className }: { value: number; className?: string }) {
  const rounded = Math.round(value * 10) / 10
  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <div className="inline-flex items-center gap-1 rounded-full bg-white/6 px-3 py-1 text-xs ring-1 ring-white/10">
        <Star className="h-3.5 w-3.5 text-honey" />
        <span className="text-white/85">{rounded.toFixed(1)}</span>
      </div>
    </div>
  )
}

