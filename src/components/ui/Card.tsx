import { cn } from '@/lib/utils'
import type { HTMLAttributes } from 'react'

export default function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-3xl bg-white/4 ring-1 ring-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl',
        className,
      )}
      {...props}
    />
  )
}

