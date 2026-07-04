import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

type Tone = 'honey' | 'neutral' | 'good' | 'bad'

export default function Badge({
  className,
  tone = 'neutral',
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  const tones: Record<Tone, string> = {
    honey: 'bg-honey/18 text-honey ring-1 ring-honey/22',
    neutral: 'bg-white/6 text-white/75 ring-1 ring-white/10',
    good: 'bg-emerald-400/12 text-emerald-200 ring-1 ring-emerald-300/20',
    bad: 'bg-red-400/12 text-red-200 ring-1 ring-red-300/20',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}

