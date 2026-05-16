'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import type { Profile } from '@/types'

interface NavbarProps {
  profile: Profile
}

const navItems = [
  { id: 'home', label: '~/home' },
  { id: 'projects', label: '~/projects' },
  { id: 'skills', label: '~/skills' },
  { id: 'terminal', label: '~/terminal' },
]

export function Navbar({ profile }: NavbarProps) {
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      const sections = ['home', 'projects', 'skills', 'terminal']
      for (const id of sections) {
        const el = document.getElementById(`section-${id}`)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom > 100) {
            setActive(id)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(`section-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActive(id)
      setMobileOpen(false)
    }
  }

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-[var(--border)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <motion.div
            className="w-2 h-2 rounded-full bg-[var(--cyan)]"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ boxShadow: '0 0 10px var(--cyan)' }}
          />
          <span className="font-mono text-sm">
            <span className="text-[var(--text-3)]">sys:</span>
            <span className="text-[var(--text)] font-medium">{profile.name}</span>
            <span className="text-[var(--cyan)]">.dev</span>
          </span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`font-mono text-xs px-4 py-2 rounded-lg transition-all duration-200 letter-spacing-wide ${
                active === item.id
                  ? 'text-[var(--cyan)] bg-[var(--cyan-glow)]'
                  : 'text-[var(--text-3)] hover:text-[var(--cyan)] hover:bg-[var(--cyan-glow)]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Status + mobile toggle */}
        <div className="flex items-center gap-4">
          {profile.available_for_work && (
            <div className="hidden sm:flex items-center gap-2">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[var(--green)]"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ boxShadow: '0 0 6px var(--green)' }}
              />
              <span className="font-mono text-xs text-[var(--green)]">online</span>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden text-[var(--text-3)] hover:text-[var(--cyan)] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5 w-5">
              <motion.span
                className="block h-px bg-current"
                animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-px bg-current"
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-px bg-current"
                animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-[var(--border)] bg-[var(--bg-primary)]"
          >
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`w-full text-right font-mono text-sm px-6 py-3 transition-colors ${
                  active === item.id
                    ? 'text-[var(--cyan)] bg-[var(--cyan-glow)]'
                    : 'text-[var(--text-2)] hover:text-[var(--cyan)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
