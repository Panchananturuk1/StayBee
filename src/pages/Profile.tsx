import { Link, useNavigate } from 'react-router-dom'
import { CalendarCheck, LogOut, User } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { useSessionStore } from '@/store/useSessionStore'

export default function Profile() {
  const navigate = useNavigate()
  const user = useSessionStore((s) => s.user)
  const isLoading = useSessionStore((s) => s.isLoading)
  const signOut = useSessionStore((s) => s.signOut)

  if (!user) {
    return (
      <Card className="p-10">
        <div className="flex items-start gap-4">
          <User className="h-6 w-6 text-honey" />
          <div>
            <div className="font-display text-2xl tracking-tight text-white">Sign in to view your profile</div>
            <div className="mt-2 text-sm text-white/60">
              Your profile and bookings are tied to your account.
            </div>
            <div className="mt-6">
              <Button onClick={() => navigate('/auth', { state: { redirectTo: '/profile' } })}>Sign in</Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-medium tracking-wide text-white/55">Account</div>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-white">Profile</h1>
        <div className="mt-2 text-sm text-white/60">Manage your details and access your bookings.</div>
      </div>

      <Card className="p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="font-display text-2xl tracking-tight text-white">{user.fullName}</div>
            <div className="mt-1 text-sm text-white/60">{user.email}</div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/bookings">
              <Button variant="secondary">
                <CalendarCheck className="h-4 w-4" />
                Booking history
              </Button>
            </Link>
            <Button
              variant="secondary"
              disabled={isLoading}
              onClick={async () => {
                await signOut()
                navigate('/')
              }}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

