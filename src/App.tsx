import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AppShell from '@/components/AppShell'
import Home from '@/pages/Home'
import Search from '@/pages/Search'
import HotelDetails from '@/pages/HotelDetails'
import Checkout from '@/pages/Checkout'
import Bookings from '@/pages/Bookings'
import Saved from '@/pages/Saved'
import Auth from '@/pages/Auth'
import ForgotPassword from '@/pages/ForgotPassword'
import ResetPassword from '@/pages/ResetPassword'
import AdminHotels from '@/pages/AdminHotels'
import AdminHotelEdit from '@/pages/AdminHotelEdit'
import Profile from '@/pages/Profile'
import Privacy from '@/pages/Privacy'
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
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/admin/hotels" element={<AdminHotels />} />
          <Route path="/admin/hotels/:hotelId" element={<AdminHotelEdit />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}
