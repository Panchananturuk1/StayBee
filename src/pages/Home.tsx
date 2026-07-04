import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import SearchBar from '@/components/SearchBar'
import HotelCard from '@/components/HotelCard'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { hotels } from '@/data/stays'

export default function Home() {
  const featured = hotels.slice(0, 3)

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[40px] bg-white/3 p-6 ring-1 ring-white/10 md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(900px_500px_at_10%_-10%,rgba(255,197,61,0.25),transparent_60%),radial-gradient(800px_600px_at_120%_10%,rgba(120,119,198,0.20),transparent_55%),radial-gradient(800px_700px_at_30%_120%,rgba(32,178,170,0.14),transparent_60%)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs text-white/70 ring-1 ring-white/10">
            <Sparkles className="h-4 w-4 text-honey" />
            Urban honey, night ink — fast hotel booking demo
          </div>

          <div className="mt-7 grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-white md:text-6xl">
                Find a stay that feels like a secret.
              </h1>
              <p className="mt-5 max-w-xl text-base text-white/65 md:text-lg">
                Search, compare, and book in minutes. No payment flows — just a clean, confident
                booking experience with local demo data.
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
                    <div>Ocean-view mornings</div>
                    <div className="text-white/85">from $165</div>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/4 px-4 py-3 ring-1 ring-white/10">
                    <div>Resort reset mode</div>
                    <div className="text-white/85">spa + pool</div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="mt-10">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="text-xs font-medium tracking-wide text-white/55">Featured</div>
            <h2 className="mt-2 font-display text-3xl tracking-tight text-white">Stays with a vibe</h2>
          </div>
          <Link to="/search" className="text-sm text-white/65 underline-offset-4 hover:text-white hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((h) => (
            <HotelCard key={h.id} hotel={h} />
          ))}
        </div>
      </section>
    </div>
  )
}
