import { cn } from '@/lib/utils'
import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
}

export default function Button({
  className,
  variant = 'primary',
  size = 'md',
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-full font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:opacity-50 disabled:pointer-events-none'

  const sizes: Record<Size, string> = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-5 text-sm',
  }

  const variants: Record<Variant, string> = {
    primary:
      'bg-gradient-to-b from-honey/95 to-honey/75 text-ink shadow-honey-sm hover:shadow-honey-md hover:from-honey hover:to-honey/75',
    secondary:
      'bg-white/5 text-white ring-1 ring-white/10 hover:bg-white/8 hover:ring-white/18',
    ghost: 'bg-transparent text-white/80 hover:bg-white/6 hover:text-white',
    danger:
      'bg-gradient-to-b from-red-400/95 to-red-500/80 text-white ring-1 ring-red-300/30 hover:from-red-400 hover:to-red-500',
  }

  return (
    <button
      className={cn(base, sizes[size], variants[variant], className)}
      disabled={disabled}
      {...props}
    />
  )
}
