'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (res.ok) { router.push('/admin'); router.refresh() }
      else setError(data.error || 'Login failed')
    } catch { setError('Could not connect to server') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-2)] rounded-2xl p-10">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔐</div>
            <h1 className="text-xl font-semibold text-[var(--text)]">Admin Panel</h1>
            <p className="font-mono text-xs text-[var(--text-3)] mt-1" style={{ letterSpacing: '0.08em' }}>
              admin.access_required
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="font-mono text-xs text-[var(--cyan)] block mb-2 uppercase tracking-widest">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text)] font-mono text-sm outline-none transition-colors focus:border-[var(--cyan-2)] placeholder-[var(--text-3)]"
                autoFocus
              />
            </div>

            {error && (
              <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="font-mono text-xs text-[var(--red)] text-center">
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-lg font-semibold text-sm bg-[var(--cyan)] text-black transition-all duration-200 hover:bg-[var(--cyan-2)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="block w-4 h-4 border-2 border-black/30 border-t-black rounded-full" />
                  Verifying...
                </span>
              ) : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="/" className="font-mono text-xs text-[var(--text-3)] hover:text-[var(--cyan)] transition-colors">
              ← Back to site
            </a>
          </div>
        </div>

        <p className="text-center font-mono text-xs text-[var(--text-3)] mt-4">
          This page is hidden and not indexed by search engines.
        </p>
      </motion.div>
    </div>
  )
}
