import { useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import SearchBar from '@/components/SearchBar'
import HotelCard from '@/components/HotelCard'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { fetchHotels } from '@/services/hotels'
import { useSearchStore } from '@/store/useSearchStore'
import type { Hotel } from '@/types/stay'

const isNativeApp = Capacitor.isNativePlatform()

export default function Home() {
  const [featured, setFeatured] = useState<Hotel[]>([])
  const [koraputHotels, setKoraputHotels] = useState<Hotel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const setBasics = useSearchStore((s) => s.setBasics)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)

    async function loadHotels() {
      try {
        const townHotels = await fetchHotels({ location: 'Koraput, Koraput' })
        const sorted = [...townHotels].sort((a, b) => b.rating - a.rating)

        if (cancelled) return
        setFeatured(sorted.slice(0, 3))
        setKoraputHotels(sorted.slice(0, 6))
      } catch {
        if (!cancelled) {
          setFeatured([])
          setKoraputHotels([])
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void loadHotels()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[40px] bg-white/3 p-6 ring-1 ring-white/10 md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_10%_-10%,rgba(255,197,61,0.25),transparent_60%),radial-gradient(800px_600px_at_120%_10%,rgba(120,119,198,0.20),transparent_55%),radial-gradient(800px_700px_at_30%_120%,rgba(32,178,170,0.14),transparent_60%)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs text-white/70 ring-1 ring-white/10">
            <Sparkles className="h-4 w-4 text-honey" />
            Live inventory, date-based pricing, and real availability
          </div>

          <div className="mt-7 grid gap-10 md:grid-cols-12 md:items-end">
            <div className={isNativeApp ? 'md:col-span-12' : 'md:col-span-7'}>
              <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-white md:text-6xl">
                Find a stay that feels like a secret.
              </h1>
              <p className="mt-5 max-w-xl text-base text-white/65 md:text-lg">
                Search hotels from the database, check live availability, and book with confidence.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link to="/search">
                  <Button className="h-12 px-7">
                    Explore stays <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link
                  to="/saved"
                  className="inline-flex items-center text-sm text-white/65 underline-offset-4 hover:text-white hover:underline"
                >
                  View saved hotels
                </Link>
              </div>
            </div>

            {!isNativeApp ? (
              <div className="md:col-span-5">
                <Card className="p-5">
                  <div className="text-xs font-medium tracking-wide text-white/60">This week</div>
                  <div className="mt-2 font-display text-2xl tracking-tight text-white">
                    Honey-stamped picks
                  </div>
                  <div className="mt-4 space-y-3 text-sm text-white/60">
                    <div className="flex items-center justify-between rounded-2xl bg-white/4 px-4 py-3 ring-1 ring-white/10">
                      <div>Late-night city stays</div>
                      <div className="text-white/85">4.6+</div>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-white/4 px-4 py-3 ring-1 ring-white/10">
                      <div>Weekend pricing</div>
                      <div className="text-white/85">Fri–Sat +15%</div>
                    </div>
                    <div className="flex items-center justify-between rounded-2xl bg-white/4 px-4 py-3 ring-1 ring-white/10">
                      <div>Live room inventory</div>
                      <div className="text-white/85">Only X left</div>
                    </div>
                  </div>
                </Card>
              </div>
            ) : null}
          </div>

          <div className="mt-10">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-xs font-medium tracking-wide text-white/55">Featured</div>
            <h2 className="mt-2 font-display text-3xl tracking-tight text-white">Stays with a vibe</h2>
          </div>
          <Link to="/search" className="text-sm text-white/65 underline-offset-4 hover:text-white hover:underline">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="h-72 animate-pulse bg-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {featured.map((h) => (
              <HotelCard key={h.id} hotel={h} />
            ))}
          </div>
        )}

        <div className="space-y-4 pt-2">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs font-medium tracking-wide text-white/55">Koraput district</div>
              <h3 className="mt-2 font-display text-2xl tracking-tight text-white">Stays in Koraput town</h3>
              <p className="mt-2 text-sm text-white/60">Hotels in Koraput city, Koraput district, Odisha.</p>
            </div>
            <Link
              to="/search"
              onClick={() => setBasics({ location: 'Koraput, Koraput' })}
              className="text-sm text-white/65 underline-offset-4 hover:text-white hover:underline"
            >
              View all
            </Link>
          </div>

          {isLoading ? (
            <div className="grid gap-5 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="h-72 animate-pulse bg-white/5" />
              ))}
            </div>
          ) : koraputHotels.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {koraputHotels.map((h) => (
                <HotelCard key={h.id} hotel={h} />
              ))}
            </div>
          ) : (
            <Card className="p-6 text-sm text-white/60">No Koraput town hotels are available right now.</Card>
          )}
        </div>
      </section>
    </div>
  )
}
