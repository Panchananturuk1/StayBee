import { useEffect, useMemo, useRef, useState } from 'react'
import { CalendarCheck, LogOut, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { cn } from '@/lib/utils'
import type { SessionUser } from '@/store/useSessionStore'

function initialsFromName(name: string) {
  const parts = name
    .split(' ')
    .map((p) => p.trim())
    .filter(Boolean)

  const first = parts[0]?.[0] ?? 'U'
  const second = parts.length > 1 ? parts[1]?.[0] : parts[0]?.[1]
  return (first + (second ?? '')).toUpperCase()
}

export default function ProfileMenu({
  user,
  isLoading,
  onSignOut,
}: {
  user: SessionUser
  isLoading: boolean
  onSignOut: () => Promise<void>
}) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const initials = useMemo(() => initialsFromName(user.fullName), [user.fullName])

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: PointerEvent) {
      const target = event.target
      if (!(target instanceof Node)) return
      if (!containerRef.current?.contains(target)) setOpen(false)
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    window.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="secondary"
        className={cn(
          'h-10 w-10 rounded-full p-0 font-display text-sm tracking-tight',
          open ? 'ring-2 ring-honey/30' : '',
        )}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open profile menu"
      >
        {initials}
      </Button>

      {open ? (
        <Card className="absolute right-0 mt-2 w-[260px] p-3">
          <div className="px-2 py-2">
            <div className="truncate font-display text-lg tracking-tight text-white">{user.fullName}</div>
            <div className="truncate text-sm text-white/60">{user.email}</div>
          </div>

          <div className="my-2 h-px bg-white/10" />

          <div className="grid gap-1">
            <button
              className="inline-flex h-10 items-center gap-2 rounded-2xl px-3 text-left text-sm text-white/80 hover:bg-white/6 hover:text-white"
              onClick={() => {
                setOpen(false)
                navigate('/profile')
              }}
              type="button"
            >
              <User className="h-4 w-4" />
              Profile
            </button>
            <button
              className="inline-flex h-10 items-center gap-2 rounded-2xl px-3 text-left text-sm text-white/80 hover:bg-white/6 hover:text-white"
              onClick={() => {
                setOpen(false)
                navigate('/bookings')
              }}
              type="button"
            >
              <CalendarCheck className="h-4 w-4" />
              Booking history
            </button>
          </div>

          <div className="my-2 h-px bg-white/10" />

          <Button
            variant="secondary"
            className="h-10 w-full justify-start rounded-2xl px-3"
            disabled={isLoading}
            onClick={async () => {
              setOpen(false)
              await onSignOut()
              navigate('/')
            }}
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </Card>
      ) : null}
    </div>
  )
}

