export default function Footer() {
  return (
    <footer className="border-t border-white/6">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-5 py-8 text-sm text-white/55 md:flex-row md:items-center">
        <div>
          <span className="font-display tracking-tight text-white/80">StayBee</span>{' '}
          <span className="text-white/45">— hotel booking demo</span>
        </div>
        <div className="text-white/45">
          Built for Vercel deployment • No payments • Local data only
        </div>
      </div>
    </footer>
  )
}

