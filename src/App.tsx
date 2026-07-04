import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AppShell from '@/components/AppShell'
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import HotelDetails from '@/pages/HotelDetails'
import Checkout from '@/pages/Checkout'
import Bookings from '@/pages/Bookings'
import Saved from '@/pages/Saved'
import Auth from '@/pages/Auth'
import NotFound from '@/pages/NotFound'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/hotels/:hotelId" element={<HotelDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}
