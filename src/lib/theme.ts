import { useState, useEffect } from 'react'

export type Theme = 'dark' | 'light' | 'system'

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light')
  } else {
    root.setAttribute('data-theme', theme)
  }
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('crux-theme') as Theme) ?? 'dark'
  })

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // track system preference changes when theme === 'system'
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applyTheme('system')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  function setTheme(t: Theme) {
    localStorage.setItem('crux-theme', t)
    setThemeState(t)
  }

  return { theme, setTheme }
}

// initialise on module load so theme is applied before first render
applyTheme((localStorage.getItem('crux-theme') as Theme) ?? 'dark')
