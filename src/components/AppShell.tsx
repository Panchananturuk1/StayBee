import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AppShell() {
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

