import { cn } from '@/lib/utils'
import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  hint?: string
  error?: string
}

export default function Input({ className, label, hint, error, id, ...props }: InputProps) {
  const inputId = id || props.name || undefined
  return (
    <label className="block">
      {label ? (
        <div className="mb-2 text-xs font-medium tracking-wide text-white/70">{label}</div>
      ) : null}
      <input
        id={inputId}
        className={cn(
          'h-11 w-full rounded-2xl bg-white/5 px-4 text-sm text-white placeholder:text-white/35 ring-1 ring-white/10 transition focus:outline-none focus:ring-2 focus:ring-honey/50',
          error ? 'ring-red-300/30 focus:ring-red-400/50' : '',
          className,
        )}
        {...props}
      />
      {error ? (
        <div className="mt-2 text-xs text-red-200">{error}</div>
      ) : hint ? (
        <div className="mt-2 text-xs text-white/45">{hint}</div>
      ) : null}
    </label>
  )
}

