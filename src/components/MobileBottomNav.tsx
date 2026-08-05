import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { App } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import { ArrowLeft, CalendarCheck, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export function useIsNativeApp() {
  return Capacitor.isNativePlatform()
}

function NavButton({
  label,
  active,
  onClick,
  icon: Icon,
}: {
  label: string
  active?: boolean
  onClick: () => void
  icon: typeof Home
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition',
        active ? 'bg-honey/18 text-honey' : 'text-white/65 hover:bg-white/6 hover:text-white',
      )}
    >
      <Icon className={cn('h-5 w-5', active ? 'text-honey' : 'text-white/75')} />
      <span>{label}</span>
    </button>
  )
}

export default function MobileBottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const isNative = useIsNativeApp()

  useEffect(() => {
    if (!isNative) return

    const listener = App.addListener('backButton', () => {
      if (location.pathname === '/' || window.history.length <= 1) {
        void App.exitApp()
        return
      }

      navigate(-1)
    })

    return () => {
      void listener.then((handle) => handle.remove())
    }
  }, [isNative, location.pathname, navigate])

  if (!isNative) return null

  const isHome = location.pathname === '/'
  const isBookings = location.pathname.startsWith('/bookings')

  function goBack() {
    if (location.pathname === '/' || window.history.length <= 1) {
      navigate('/')
      return
    }

    navigate(-1)
  }

  return (
    <nav
      aria-label="App navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/8 bg-ink/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-lg items-stretch gap-2">
        <NavButton label="Back" icon={ArrowLeft} onClick={goBack} />
        <NavButton label="Home" icon={Home} active={isHome} onClick={() => navigate('/')} />
        <NavButton
          label="Bookings"
          icon={CalendarCheck}
          active={isBookings}
          onClick={() => navigate('/bookings')}
        />
      </div>
    </nav>
  )
}
