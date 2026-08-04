import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useSessionStore } from '@/store/useSessionStore'

export default function ForgotPassword() {
  const requestPasswordReset = useSessionStore((s) => s.requestPasswordReset)
  const isLoading = useSessionStore((s) => s.isLoading)

  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [resetPath, setResetPath] = useState<string | null>(null)

  return (
    <div className="mx-auto max-w-xl">
      <Card className="p-8 md:p-10">
        <div className="text-xs font-medium tracking-wide text-white/55">Account</div>
        <div className="mt-2 font-display text-3xl tracking-tight text-white">Forgot password</div>
        <div className="mt-2 text-sm text-white/60">
          Enter your email and we&apos;ll help you set a new password.
        </div>

        <div className="mt-6 grid gap-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          {error ? (
            <div className="rounded-2xl bg-red-400/10 px-4 py-3 text-sm text-red-100 ring-1 ring-red-300/20">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="rounded-2xl bg-honey/10 px-4 py-3 text-sm text-white/80 ring-1 ring-honey/15">
              {message}
              {resetPath ? (
                <div className="mt-3">
                  <Link to={resetPath} className="font-medium text-honey hover:text-honey/90">
                    Continue to reset password
                  </Link>
                </div>
              ) : null}
            </div>
          ) : null}

          <Button
            className="h-12"
            disabled={isLoading}
            onClick={async () => {
              setError(null)
              setMessage(null)
              setResetPath(null)

              const res = await requestPasswordReset(email)
              if (res.ok === false) {
                setError(res.message)
                return
              }

              setMessage(res.message)
              setResetPath(res.resetPath ?? null)
            }}
          >
            <Mail className="h-4 w-4" />
            {isLoading ? 'Sending reset link...' : 'Send reset link'}
          </Button>

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
