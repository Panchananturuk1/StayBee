import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { KeyRound } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useSessionStore } from '@/store/useSessionStore'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const resetPassword = useSessionStore((s) => s.resetPassword)
  const isLoading = useSessionStore((s) => s.isLoading)

  const token = useMemo(() => searchParams.get('token')?.trim() || '', [searchParams])
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (!token) {
    return (
      <div className="mx-auto max-w-xl">
        <Card className="p-8 md:p-10">
          <div className="font-display text-3xl tracking-tight text-white">Invalid reset link</div>
          <div className="mt-2 text-sm text-white/60">
            This password reset link is missing or incomplete. Request a new one.
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Link to="/auth/forgot-password">
              <Button className="h-11 w-full">Request reset link</Button>
            </Link>
            <Link to="/auth">
              <Button variant="secondary" className="h-11 w-full">
                Back to sign in
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl">
      <Card className="p-8 md:p-10">
        <div className="text-xs font-medium tracking-wide text-white/55">Account</div>
        <div className="mt-2 font-display text-3xl tracking-tight text-white">Reset password</div>
        <div className="mt-2 text-sm text-white/60">Choose a new password for your account.</div>

        <div className="mt-6 grid gap-4">
          <Input
            label="New password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            hint="Minimum 6 characters"
          />
          <Input
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error ? (
            <div className="rounded-2xl bg-red-400/10 px-4 py-3 text-sm text-red-100 ring-1 ring-red-300/20">
              {error}
            </div>
          ) : null}

          <Button
            className="h-12"
            disabled={isLoading}
            onClick={async () => {
              setError(null)

              if (password.length < 6) {
                setError('Password must be at least 6 characters.')
                return
              }

              if (password !== confirmPassword) {
                setError('Passwords do not match.')
                return
              }

              const res = await resetPassword(token, password)
              if (res.ok === false) {
                setError(res.message)
                return
              }

              navigate('/auth', { state: { passwordReset: res.message } })
            }}
          >
            <KeyRound className="h-4 w-4" />
            {isLoading ? 'Updating password...' : 'Update password'}
          </Button>

          <Link to="/auth/forgot-password">
            <Button variant="secondary" className="h-11 w-full">
              Request a new link
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
