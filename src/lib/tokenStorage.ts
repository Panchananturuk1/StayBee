import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'
import { storageKeys } from '@/store/storage'

let cachedToken: string | null = null
let initialized = false

function readWebToken() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(storageKeys.sessionToken)
}

function writeWebToken(token: string | null) {
  if (typeof window === 'undefined') return

  if (token) {
    window.localStorage.setItem(storageKeys.sessionToken, token)
    return
  }

  window.localStorage.removeItem(storageKeys.sessionToken)
}

export async function initTokenStorage() {
  if (initialized) return

  if (Capacitor.isNativePlatform()) {
    const { value } = await Preferences.get({ key: storageKeys.sessionToken })
    cachedToken = value
  } else {
    cachedToken = readWebToken()
  }

  initialized = true
}

export function getSessionToken() {
  if (!initialized) {
    return readWebToken()
  }

  return cachedToken
}

export function setSessionToken(token: string | null) {
  cachedToken = token

  if (Capacitor.isNativePlatform()) {
    void (async () => {
      if (token) {
        await Preferences.set({ key: storageKeys.sessionToken, value: token })
      } else {
        await Preferences.remove({ key: storageKeys.sessionToken })
      }
    })()
    return
  }

  writeWebToken(token)
}
