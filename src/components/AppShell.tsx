import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useBookingStore } from '@/store/useBookingStore'
import { useSessionStore } from '@/store/useSessionStore'
import { useWishlistStore } from '@/store/useWishlistStore'

export default function AppShell() {
  const hydrateSession = useSessionStore((s) => s.hydrate)
  const user = useSessionStore((s) => s.user)
  const hasHydrated = useSessionStore((s) => s.hasHydrated)
  const loadBookings = useBookingStore((s) => s.loadBookings)
  const resetBookings = useBookingStore((s) => s.reset)
  const loadSaved = useWishlistStore((s) => s.loadSaved)
  const resetSaved = useWishlistStore((s) => s.reset)

  useEffect(() => {
    void hydrateSession()
  }, [hydrateSession])

  useEffect(() => {
    if (!hasHydrated) return

    if (!user) {
      resetBookings()
      resetSaved()
      return
    }

    void Promise.all([loadBookings(), loadSaved()])
  }, [hasHydrated, loadBookings, loadSaved, resetBookings, resetSaved, user])

  return (
    <div className="min-h-screen bg-mesh-ink">
      <Header />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
