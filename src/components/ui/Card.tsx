import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

export default function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-3xl bg-white/4 ring-1 ring-white/10 shadow-card backdrop-blur-xl',
        className,
      )}
      {...props}
    />
  )
}

