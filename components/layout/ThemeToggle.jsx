'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle({ className = '' }) {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = stored === 'dark' || (!stored && prefersDark)
    
    if (isDark) {
      document.documentElement.classList.add('dark')
      setTheme('dark')
    } else {
      document.documentElement.classList.remove('dark')
      setTheme('light')
    }

    const handleThemeChange = () => {
      const activeDark = document.documentElement.classList.contains('dark')
      setTheme(activeDark ? 'dark' : 'light')
    }

    window.addEventListener('theme-change', handleThemeChange)
    return () => window.removeEventListener('theme-change', handleThemeChange)
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }

    window.dispatchEvent(new Event('theme-change'))
  }

  // Render a clean skeleton placeholder during SSR to prevent layout shift
  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        aria-hidden="true"
        className={`w-8 h-8 rounded-full border border-luxury-border/40 opacity-50 flex items-center justify-center ${className}`}
      >
        <span className="w-3.5 h-3.5 block" />
      </button>
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light editorial theme' : 'Switch to dark editorial theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`relative inline-flex items-center justify-center w-8 h-8 rounded-full border border-luxury-border/60 hover:border-luxury-accent bg-luxury-card/60 hover:bg-luxury-card text-luxury-muted hover:text-luxury-text transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-luxury-accent ${className}`}
    >
      {isDark ? (
        <Sun className="w-3.5 h-3.5 text-luxury-accent animate-in fade-in zoom-in-75 duration-200" />
      ) : (
        <Moon className="w-3.5 h-3.5 text-luxury-muted group-hover:text-luxury-text animate-in fade-in zoom-in-75 duration-200" />
      )}
    </button>
  )
}
