import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean
}

export default function Chip({ className, selected, ...props }: ChipProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center rounded-full px-4 py-2 text-xs font-medium ring-1 transition',
        selected
          ? 'bg-honey/20 text-honey ring-honey/25'
          : 'bg-white/4 text-white/70 ring-white/12 hover:bg-white/7 hover:text-white',
        className,
      )}
      {...props}
    />
  )
}

