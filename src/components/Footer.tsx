export default function Footer() {
  return (
    <footer className="border-t border-white/6">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-5 py-8 text-sm text-white/55 md:flex-row md:items-center">
        <div>
          <span className="font-display tracking-tight text-white/80">StayBee</span>{' '}
          <span className="text-white/45">— hotel booking demo</span>
        </div>
        <div className="flex flex-col gap-2 text-white/45 md:items-end">
          <a href="/privacy" className="hover:text-white/70 hover:underline underline-offset-4">
            Privacy Policy
          </a>
          <span>Built for Vercel deployment • Demo booking app</span>
        </div>
      </div>
    </footer>
  )
}

