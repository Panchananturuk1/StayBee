import { useCallback, useEffect, useState } from 'react'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

const chrome: Record<Theme, { themeColor: string; statusBar: Style }> = {
  dark: { themeColor: '#0b0f14', statusBar: Style.Dark },
  light: { themeColor: '#f7f8fb', statusBar: Style.Light },
}

function readInitialTheme(): Theme {
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('light')) {
    return 'light'
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Storage can be unavailable in private mode; fall back to the OS preference.
  }

  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)

    const { themeColor, statusBar } = chrome[theme]

    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', themeColor)

    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Persisting the choice is best-effort.
    }

    if (Capacitor.isNativePlatform()) {
      void StatusBar.setStyle({ style: statusBar }).catch(() => {})
      void StatusBar.setBackgroundColor({ color: themeColor }).catch(() => {})
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((previous) => (previous === 'light' ? 'dark' : 'light'))
  }, [])

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
  }
}
