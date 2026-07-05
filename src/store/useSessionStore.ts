import { create } from 'zustand'
import { ApiError, apiFetch, getSessionToken, setSessionToken } from '@/lib/api'

export type SessionUser = {
  id: string
  email: string
  fullName: string
}

type SessionState = {
  user: SessionUser | null
  hasHydrated: boolean
  isLoading: boolean
  hydrate: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>
  signUp: (fullName: string, email: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>
  signOut: () => Promise<void>
}

export const useSessionStore = create<SessionState>()((set) => ({
  user: null,
  hasHydrated: false,
  isLoading: false,
  hydrate: async () => {
    if (!getSessionToken()) {
      set({ user: null, hasHydrated: true, isLoading: false })
      return
    }

    set({ isLoading: true })

    try {
      const data = await apiFetch<{ user: SessionUser }>('/api/auth/session')
      set({ user: data.user, hasHydrated: true, isLoading: false })
    } catch {
      setSessionToken(null)
      set({ user: null, hasHydrated: true, isLoading: false })
    }
  },
  signIn: async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail || password.length < 6) {
      return { ok: false, message: 'Email and password are required (min 6 chars).' }
    }

    set({ isLoading: true })

    try {
      const data = await apiFetch<{ user: SessionUser; token: string }>('/api/auth/login', {
        method: 'POST',
        body: {
          email: normalizedEmail,
          password,
        },
      })

      setSessionToken(data.token)
      set({ user: data.user, hasHydrated: true, isLoading: false })
      return { ok: true }
    } catch (error) {
      set({ isLoading: false })
      return {
        ok: false,
        message: error instanceof ApiError ? error.message : 'Unable to sign in right now.',
      }
    }
  },
  signUp: async (fullName, email, password) => {
    const normalizedEmail = email.trim().toLowerCase()
    if (!fullName.trim()) return { ok: false, message: 'Full name is required.' }
    if (!normalizedEmail || !normalizedEmail.includes('@')) return { ok: false, message: 'Enter a valid email.' }
    if (password.length < 6) return { ok: false, message: 'Password must be at least 6 characters.' }

    set({ isLoading: true })

    try {
      const data = await apiFetch<{ user: SessionUser; token: string }>('/api/auth/signup', {
        method: 'POST',
        body: {
          fullName: fullName.trim(),
          email: normalizedEmail,
          password,
        },
      })

      setSessionToken(data.token)
      set({ user: data.user, hasHydrated: true, isLoading: false })
      return { ok: true }
    } catch (error) {
      set({ isLoading: false })
      return {
        ok: false,
        message: error instanceof ApiError ? error.message : 'Unable to create your account right now.',
      }
    }
  },
  signOut: async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' })
    } catch {
      // Clearing the local token still signs the user out on this device.
    } finally {
      setSessionToken(null)
      set({ user: null, isLoading: false, hasHydrated: true })
    }
  },
}))
