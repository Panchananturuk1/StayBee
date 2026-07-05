import type { ComponentType } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Bookmark, CalendarCheck, Compass, LogIn, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'
import Button from '@/components/ui/Button'
import { useSessionStore } from '@/store/useSessionStore'

function NavItem({
  to,
  label,
  icon: Icon,
}: {
  to: string
  label: string
  icon: ComponentType<{ className?: string }>
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ring-1 transition',
          isActive
            ? 'bg-honey/18 text-honey ring-honey/25'
            : 'bg-white/0 text-white/70 ring-white/0 hover:bg-white/6 hover:text-white',
        )
      }
    >
      <Icon className="h-4 w-4 opacity-80 group-hover:opacity-100" />
      <span className="hidden sm:inline">{label}</span>
    </NavLink>
  )
}

export default function Header() {
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const user = useSessionStore((s) => s.user)
  const hasHydrated = useSessionStore((s) => s.hasHydrated)
  const isLoading = useSessionStore((s) => s.isLoading)
  const signOut = useSessionStore((s) => s.signOut)

  return (
    <header className="sticky top-0 z-40 border-b border-white/6 bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <button
          onClick={() => navigate('/')}
          className="group inline-flex items-baseline gap-2"
        >
          <span className="font-display text-xl tracking-tight text-white">Stay</span>
          <span className="font-display text-xl tracking-tight text-honey">Bee</span>
          <span className="ml-2 hidden rounded-full bg-white/5 px-3 py-1 text-xs text-white/60 ring-1 ring-white/10 sm:inline">
            demo booking
          </span>
        </button>

        <nav className="hidden items-center gap-2 md:flex">
          <NavItem to="/" label="Explore" icon={Compass} />
          <NavItem to="/saved" label="Saved" icon={Bookmark} />
          <NavItem to="/bookings" label="Bookings" icon={CalendarCheck} />
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" className="h-10 px-3" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden text-sm text-white/70 sm:block">
                {user.fullName}
              </div>
              <Button variant="secondary" className="h-10 px-4" disabled={isLoading} onClick={() => void signOut()}>
                Sign out
              </Button>
            </div>
          ) : (
            <Button
              variant="secondary"
              className="h-10 px-4"
              disabled={!hasHydrated || isLoading}
              onClick={() => navigate('/auth')}
            >
              <LogIn className="h-4 w-4" />
              {!hasHydrated ? 'Loading' : 'Sign in'}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
