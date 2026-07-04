import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound, UserRound } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Chip from '@/components/ui/Chip'
import { useSessionStore } from '@/store/useSessionStore'

type Mode = 'signin' | 'signup'

export default function Auth() {
  const navigate = useNavigate()
  const user = useSessionStore((s) => s.user)
  const signIn = useSessionStore((s) => s.signIn)
  const signUp = useSessionStore((s) => s.signUp)

  const [mode, setMode] = useState<Mode>('signin')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (user) {
    return (
      <Card className="p-10">
        <div className="font-display text-3xl tracking-tight text-white">You’re signed in.</div>
        <div className="mt-2 text-sm text-white/60">This is a demo session stored locally.</div>
        <div className="mt-6">
          <Button onClick={() => navigate('/')}>Go home</Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="mx-auto max-w-xl">
      <Card className="p-8 md:p-10">
        <div className="text-xs font-medium tracking-wide text-white/55">Demo auth</div>
        <div className="mt-2 font-display text-3xl tracking-tight text-white">Sign in to save bookings</div>
        <div className="mt-2 text-sm text-white/60">No email verification. Password is for demo only.</div>

        <div className="mt-6 flex items-center gap-2">
          <Chip selected={mode === 'signin'} onClick={() => setMode('signin')}>
            Sign in
          </Chip>
          <Chip selected={mode === 'signup'} onClick={() => setMode('signup')}>
            Create account
          </Chip>
        </div>

        <div className="mt-6 grid gap-4">
          {mode === 'signup' ? (
            <Input
              label="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Alex Rivera"
            />
          ) : null}
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            hint="Minimum 6 characters"
          />

          {error ? <div className="rounded-2xl bg-red-400/10 px-4 py-3 text-sm text-red-100 ring-1 ring-red-300/20">{error}</div> : null}

          <Button
            className="h-12"
            onClick={() => {
              setError(null)
              const res =
                mode === 'signin'
                  ? signIn(email, password)
                  : signUp(fullName, email, password)
              if (res.ok === false) {
                setError(res.message)
                return
              }
              navigate('/')
            }}
          >
            {mode === 'signin' ? (
              <>
                <KeyRound className="h-4 w-4" /> Sign in
              </>
            ) : (
              <>
                <UserRound className="h-4 w-4" /> Create account
              </>
            )}
          </Button>

          <Button variant="secondary" className="h-11" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </Card>
    </div>
  )
}
