import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { storageKeys } from '@/store/storage'

export type SessionUser = {
  email: string
  fullName: string
}

type SessionState = {
  user: SessionUser | null
  signIn: (email: string, password: string) => { ok: true } | { ok: false; message: string }
  signUp: (fullName: string, email: string, password: string) => { ok: true } | { ok: false; message: string }
  signOut: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      user: null,
      signIn: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase()
        if (!normalizedEmail || password.length < 6) {
          return { ok: false, message: 'Email and password are required (min 6 chars).' }
        }
        const existing = get().user
        if (existing && existing.email !== normalizedEmail) {
          return { ok: false, message: 'This demo session is already signed in. Sign out first.' }
        }
        set({ user: { email: normalizedEmail, fullName: normalizedEmail.split('@')[0] || 'Guest' } })
        return { ok: true }
      },
      signUp: (fullName, email, password) => {
        const normalizedEmail = email.trim().toLowerCase()
        if (!fullName.trim()) return { ok: false, message: 'Full name is required.' }
        if (!normalizedEmail || !normalizedEmail.includes('@')) return { ok: false, message: 'Enter a valid email.' }
        if (password.length < 6) return { ok: false, message: 'Password must be at least 6 characters.' }
        set({ user: { email: normalizedEmail, fullName: fullName.trim() } })
        return { ok: true }
      },
      signOut: () => set({ user: null }),
    }),
    {
      name: storageKeys.session,
      partialize: (s) => ({ user: s.user }),
    },
  ),
)

